const encoding = require('dat-encoding')
const response = require('response')
const Users = require('./users')
const Dats = require('./dats')
const Haus = require('../haus')

module.exports = function (router, db, ship) {
  function onerror (err, res) {
    var data = {statusCode: 400, message: err.message}
    return response.json(data).status(400).pipe(res)
  }

  var routes = {
    users: Users(db.models.users),
    dats: Dats(db.models.dats)
  }

  function apiRouter (req, res) {
    var model = routes[req.params.model]
    if (!model) return onerror(new Error('Model ' + req.params.model + ' not found.'), res)
    var route = model[req.method.toLowerCase()].bind(model)
    if (!route) return onerror(new Error('No ' + req.method + ' route.'), res)

    var authHeader = req.headers.authorization
    if (authHeader && authHeader.indexOf('Bearer') > -1) {
      var token = authHeader.split('Bearer ')[1]
      if (!token) return route(req, done)
    }
    if (!authHeader) return route(req, done)
    req.user = null

    ship.verify(req, function (err, decoded, token) {
      if (err) return onerror(err, res)
      if (!decoded) return route(req, done)
      db.models.users.get({email: decoded.auth.basic.email}, function (err, results) {
        if (err) return onerror(err, res)
        req.user = results[0]
        return route(req, done)
      })
    })

    function done (err, data) {
      if (err) return onerror(err, res)
      response.json(data).status(200).pipe(res)
    }
  }

  router.get('/api/v1/dats/health', function (req, res) {
    var key = req.query.key
    try {
      encoding.toBuf(key)
    } catch (e) {
      return onerror(e, res)
    }
    var cancelled = false
    setTimeout(function () {
      if (cancelled) return
      cancelled = true
      return onerror(new Error('Could not find any peers.'), res)
    }, 5000)
    var dat = Haus(key)
    dat.archive.open(function (err) {
      if (err) return onerror(err, res)
      if (cancelled) return
      cancelled = true
      var interval = setInterval(function () {
        res.write(JSON.stringify(dat.health.get()) + '\n')
      }, req.query.interval || 2000)
      res.on('finish', function () {
        dat.close(function () {
          clearInterval(interval)
          res.end()
        })
      })
    })
  })

  router.get('/api/v1/:username/:dataset', function (req, res) {
    db.queries.getDatByShortname(req.params, function (err, dat) {
      if (err) return onerror(err, res)
      res.json(dat)
    })
  })

  router.get('/api/v1/:model', apiRouter)
  router.post('/api/v1/:model', apiRouter)
  router.put('/api/v1/:model', apiRouter)
  router.delete('/api/v1/:model', apiRouter)
}
