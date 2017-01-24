const township = require('township')
const path = require('path')
const response = require('response')
const level = require('level-party')
const verify = require('./verify')
const errors = require('../errors')

module.exports = function (router, db, opts) {
  const townshipDb = level(opts.township.db || path.join(__dirname, 'township.db'))
  const ship = township(townshipDb, opts.township)

  function onerror (err, res) {
    var data = {statusCode: 400, message: errors.humanize(err).message}
    return response.json(data).status(400).pipe(res)
  }

  router.post('/api/v1/register', function (req, res) {
    if (!req.body.email) return onerror(new Error('Email required.'), res)
    if (!req.body.username) return onerror(new Error('Username required.'), res)
    verify(req.body, {whitelist: opts.whitelist}, function (err) {
      if (err) return onerror(err, res)
      ship.register(req, res, {body: req.body}, function (err, statusCode, obj) {
        if (err) return onerror(err, res)
        db.models.users.create({email: req.body.email, username: req.body.username}, function (err, body) {
          if (err) return onerror(err, res)
          body.token = obj.token
          body.key = obj.key
          return response.json(body).status(200).pipe(res)
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
        if (!results) return onerror(new Error('Failed to create user.'), res)
        var user = results[0]
        obj.email = user.email
        obj.username = user.username
        obj.role = user.role
        obj.description = user.description
        return response.json(obj).status(200).pipe(res)
      })
    })
  })

  return ship
}
