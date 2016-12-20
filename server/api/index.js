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

  function apiRouter (req, res) {
    ship.verify(req, res, function (err, decoded, token) {
      if (err) return onerror(err, res)
      var model = routes[req.params.model]
      if (!model) return onerror(new Error('Model ' + req.params.model + ' not found.'), res)
      var route = model[req.method.toLowerCase()].bind(model)
      if (!route) return onerror(new Error('No ' + req.method + ' route.'), res)

      var ctx = {body: null, params: req.params, user: null}
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

  router.get('/api/v1/:username/:dataset', function (req, res) {
    // TODO: do it in one db query not two
    db.models.users.get({username: req.params.username}, function (err, results) {
      if (err) return onerror(err, res)
      if (!results.length) return error(404, 'Not found').pipe(res)
      var user = results[0]
      db.models.dats.get({user_id: user.id, name: req.params.dataset}, function (err, results) {
        if (err) return onerror(err, res)
        var dat = results[0]
        if (!dat) return error(404, 'Not found').pipe(res)
        send(200, dat).pipe(res)
      })
    })
  })

  router.get('/api/v1/:model', apiRouter)
  router.post('/api/v1/:model', apiRouter)
  router.put('/api/v1/:model', apiRouter)
  router.delete('/api/v1/:model', apiRouter)
}
