var url = require('url')
var Router = require('routes-router')
var response = require('response')
var debug = require('debug')('routes')
var sqliteSearch = require('sqlite-search')
var concat = require('concat-stream')

var authorize = require('./authorize')
var defaults = require('./defaults.js')

module.exports = function createRoutes(server) {
  var router = Router({
    errorHandler: function (req, res, err) {
      console.trace('Router error', err)
      response.json({
        'status': 'error',
        'message': err.message
      }).pipe(res)
    },
    notFound: function (req, res) {
      debug('not found', req.url)
      res.statusCode = 404
      res.end('not found')
    }
  })

  router.addRoute('/auth/github/login', function(req, res, opts) {
    server.auth.github.oauth.login(req, res)
  })

  router.addRoute('/auth/github/callback', function(req, res, opts) {
    server.auth.github.oauth.callback(req, res)
  })

  router.addRoute('/auth/logout', function(req, res, opts) {
    return server.sessions.logout(req, res)
  })

  router.addRoute('/auth/currentuser', function (req, res) {
    server.sessions.getSession(req, function(err, session) {
      if (session) {
        var id = session.data.id
        server.models.users.get({id: id}, function (err, user) {
          if (err) {
            response.json({
              'status': 'warning',
              'message': err.message
            }).pipe(res)
            return
          }
          response.json({
            'status': 'success',
            'user': user
          }).pipe(res)
        })
      } else {
        response.json({
          'status': 'warning',
          'message': 'No current user.'
        }).pipe(res)
      }
    })
  })

  router.addRoute('/search/:field', function (req, res, opts) {
    res.setHeader('content-type', 'application/json')
    var parsed = url.parse(req.url, true)
    var query = parsed.query
    debug('request in ', parsed)

    query.field = opts.params.field
    query.formatType = 'object'
    debug('searching for ', query)

    server.models.metadat.searcher.createSearchStream(query).pipe(res)
  })

  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    res.setHeader('content-type', 'application/json')
    var id = opts.params.id
    var query = url.parse(req.url, true).query
    var model = server.models[opts.params.model]

    if (!model) {
      res.statusCode = 400
      response.json({status: 'error', message: 'Model not found'}).pipe(res)
      return
    }

    var method = req.method.toLowerCase()
    var responseOpts = {}
    if (id) responseOpts.id = id
    console.log(query)
    if (query.limit) responseOpts.limit = parseInt(query.limit)

    authorize(server, req, res, opts, function(err) {
      if (err) return unauthorized(res)

      if (method === 'get') {
        var query = getSecondaryQuery(req, model, responseOpts)
        if (query) return secondaryQuery(req, model, query, respond)
      }

      model.handler.dispatch(req, responseOpts, respond)

      function respond(err, data) {
        if (err) {
          var code = 400
          if (err.notFound) code = 404
          if (err.statusCode) code = err.statusCode
          res.statusCode = code
          response.json({status: 'error', message: err.message}).pipe(res)
          return
        }

        if (!data) data = {status: 'error', message: 'no data returned'}

        if (method === 'get' || method === 'delete') {
          res.statusCode = 200
          response.json(data).pipe(res)
          return
        }

        // if put or post then `data` should look like {created: bool, data: row}
        if (method === 'put' || method === 'post') {
          res.statusCode = data.created ? 201 : 200
          // TODO should we treat validation errors as a 200 or a 4xx?
          if (data.status && data.status === 'error') {
            res.statusCode = 200
            response.json(data).pipe(res)
            return
          }
          response.json(data.data).pipe(res)
          return
        }

        // should never get here
        debug('unknown model method', method)
        res.end()
      }
    })

  })

  return router
}

function unauthorized(res) {
  var code = 401
  res.statusCode = code
  response.json({status: 'error', error: 'action not allowed'}).pipe(res)
}

function secondaryQuery(req, model, query, cb) {
  if (query instanceof Error) return cb(query)
  var indexer = model.indexes[query.key]
  debug('finding by', query.key, 'with value', query.value)
  indexer.find(query.value, function(err, rows) {
    if (err) return cb(err)
    cb(null, rows)
  })
}

// only one secondary query dimension at a time is currently supported
function getSecondaryQuery(req, model, params) {
  var parsed = url.parse(req.url, true)
  var query = parsed.query
  if (!query) return false
  var keys = Object.keys(query)
  if (!keys && keys.length === 0) return false
  var queryObj = false
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i]
    var val = query[key]
    var indexer = model.indexes[key]
    // only allow queries on indexed properties
    if (indexer) {
      // if it already exists then there are > 1 query dimensions
      if (queryObj) {
        queryObj = new Error('multiple query parameters specified when only one is allowed')
        break
      }
      queryObj = {
        "key": key,
        "value": val
      }
    }
  }
  return queryObj
}
