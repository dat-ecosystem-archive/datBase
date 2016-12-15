const parse = require('body/json')
const url = require('url')
const qs = require('qs')
const error = require('appa/error')
const send = require('appa/send')
const isType = require('type-is')
const Users = require('./users')
const Dats = require('./dats')

module.exports = function (router, db, ship) {
  function onerror (err, res) {
    return error(400, err.message).pipe(res)
  }

  var routes = {
    users: Users(db.models.users),
    dats: Dats(db.models.dats)
  }

  function apiRouter (req, res, params) {
    ship.verify(req, res, function (err, decoded, token) {
      if (err) return onerror(err, res)
      var model = routes[params.model]
      if (!model) return onerror(new Error('Model ' + params.model + ' not found.'), res)
      var route = model[req.method.toLowerCase()].bind(model)
      if (!route) return onerror(new Error('No ' + req.method + ' route.'), res)

      var ctx = {body: null, params: params, user: null}
      if (!decoded) return processRequest(req, res, ctx, route)
      db.models.users.get({email: decoded.auth.basic.email}, function (err, results) {
        if (err) return onerror(err, res)
        ctx.user = results[0]
        return processRequest(req, res, ctx, route)
      })
    })
  }

  function processRequest (req, res, ctx, route) {
    ctx.query = qs.parse(url.parse(req.url).query)
    if ((req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') && isType(req, ['json'])) {
      return parse(req, res, function (err, body) {
        if (err) return error(400, 'Bad Request, invalid JSON').pipe(res)
        ctx.body = body
        route(ctx, done)
      })
    }

    return route(ctx, done)

    function done (err, data) {
      if (err) return onerror(err, res)
      send(data).pipe(res)
    }
  }

  router.on('/api/v1/:model', {
    get: apiRouter,
    post: apiRouter,
    put: apiRouter,
    delete: apiRouter
  })
}
