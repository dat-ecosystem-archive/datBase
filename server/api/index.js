const parse = require('body/json')
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

      var user = decoded ? {id: decoded.auth.key, email: decoded.auth.basic.email} : null

      function handleParse (err, body) {
        if (err) return error(400, 'Bad Request, invalid JSON').pipe(res)
        done(req, res, {body, params, user})
      }

      if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
        if (isType(req, ['json'])) return parse(req, res, handleParse)
      }

      return done(req, res, {params, user})

      function done (req, res, ctx) {
        var route = model[req.method.toLowerCase()].bind(model)
        if (!route) return onerror(new Error('No ' + req.method + ' route for ' + params.model), res)
        route(ctx, function (err, data) {
          if (err) return onerror(err, res)
          send(data).pipe(res)
        })
      }
    })
  }

  router.on('/api/v1/:model', {
    get: apiRouter,
    post: apiRouter,
    put: apiRouter,
    delete: apiRouter
  })
}
