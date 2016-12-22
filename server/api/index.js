const encoding = require('dat-encoding')
const error = require('appa/error')
const send = require('appa/send')
const Users = require('./users')
const Dats = require('./dats')
const Haus = require('../haus')

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

      req.user = null
      if (!decoded) return route(req, route)
      db.models.users.get({email: decoded.auth.basic.email}, function (err, results) {
        if (err) return onerror(err, res)
        req.user = results[0]
        return route(req, done)
      })
    })

    function done (err, data) {
      if (err) return onerror(err, res)
      send(data).pipe(res)
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
        dat.close()
        clearInterval(interval)
        res.end()
      })
    })
  })

  router.get('/api/v1/:username/:dataset', function (req, res) {
    // TODO: do it in one db query not two
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
