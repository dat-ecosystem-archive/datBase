const township = require('township')
const path = require('path')
const level = require('level-party')
const error = require('appa/error')
const send = require('appa/send')
const jsonBody = require('body/json')
const verify = require('./verify')

module.exports = function (router, db, opts) {
  const townshipDb = level(opts.township.db || path.join(__dirname, 'township.db'))
  const ship = township(opts.township, townshipDb)

  router.on('/auth/v1/register', {
    post: function (req, res) {
      jsonBody(req, res, function (err, body) {
        if (err) return error(401, err.message).pipe(res)
        if (!body.email) return error(400, 'must specify email').pipe(res)
        verify(body.email, function (err) {
          if (err) return error(401, err.message).pipe(res)
          ship.register(req, res, {body: body}, function (err, statusCode, obj) {
            if (err) return error(400, err.message).pipe(res)
            db.models.users.create({email: body.email, id: obj.key}, function (err, body) {
              if (err) return error(400, err.message).pipe(res)
              body.token = obj.token
              return send(body).pipe(res)
            })
          })
        })
      })
    }
  })

  router.on('/auth/v1/login', {
    post: function (req, res, params) {
      jsonBody(req, res, function (err, body) {
        if (err) return error(401, err.message).pipe(res)
        ship.login(req, res, {body: body}, function (err, resp, body) {
          if (err) return error(400, err.message).pipe(res)
          send(body).pipe(res)
        })
      })
    }
  })

  return ship
}
