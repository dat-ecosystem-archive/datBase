var Router = require('routes-router')
var response = require('response')

var authorize = require('./authorize')

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

  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    res.setHeader('content-type', 'application/json')
    var id = opts.params.id
    var model = server.models[opts.params.model]
    
    if (!model) {
      res.statusCode = 400
      response.json({error: 'Model not found'}).pipe(res)
      return 
    }
    
    var method = req.method.toLowerCase()
    var params = {}
    if (id) params.id = id
      
    authorize(server, req, res, opts, function(err) {
      if (err) return unauthorized(res)
      model.handler.dispatch(req, params, function(err, data) {
        if (err) {
          var code = 400
          if (err.notFound) code = 404
          if (err.statusCode) code = err.statusCode
          res.statusCode = code
          response.json({status: 'error', error: err.message}).pipe(res)
          return
        }
      
        if (!data) data = {status: 'error', error: 'no data returned'}
            
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
      })      
    })
    
  })

  return router
}

function unauthorized(res) {
  var code = 401
  res.statusCode = code
  response.json({status: 'error', error: 'action not allowed'}).pipe(res)
}