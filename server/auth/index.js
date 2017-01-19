const township = require('township')
const path = require('path')
const level = require('level-party')
const error = require('appa/error')
const send = require('appa/send')
const verify = require('./verify')
const errors = require('../errors')

module.exports = function (router, db, opts) {
  const townshipDb = level(opts.township.db || path.join(__dirname, 'township.db'))
  const ship = township(opts.township, townshipDb)

  function onerror (err, res) {
    return error(400, errors.humanize(err).message).pipe(res)
  }

  router.post('/api/v1/register', function (req, res) {
    if (!req.body.email) return error(400, 'Email required.').pipe(res)
    if (!req.body.username) return error(400, 'Username required.').pipe(res)
    verify(req.body, {whitelist: opts.whitelist}, function (err) {
      if (err) return onerror(err, res)
      ship.register(req, res, {body: req.body}, function (err, statusCode, obj) {
        if (err) return onerror(err, res)
        db.models.users.create({email: req.body.email, username: req.body.username}, function (err, body) {
          if (err) return onerror(err, res)
          body.token = obj.token
          body.key = obj.key
          return send(body).pipe(res)
        })
      })
    })
  })

  router.post('/api/v1/login', function (req, res) {
    var body = req.body
    ship.login(req, res, {body: body}, function (err, resp, obj) {
      if (err) return onerror(err, res)
      db.models.users.get({email: body.email}, function (err, results) {
        if (err) return onerror(err, res)
        if (!results) return error(400, 'Failed to create user.').pipe(res)
        var user = results[0]
        obj.email = user.email
        obj.username = user.username
        obj.role = user.role
        obj.description = user.description
        send(obj).pipe(res)
      })
    })
  })

  return ship
}
