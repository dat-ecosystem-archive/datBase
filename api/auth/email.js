var level = require('level')
var models = require('../models.js')
var jsonBody = require("body/json")

exports.create = function (req, res, opts, cb) {
  jsonBody(req, res, function (err, body) {
    if (err) {
      res.statusCode = 500
      return res.end("NO U")
    }
    models.users.create({
      handle: body.handle,
      password: body.password,
      email: body.email
    }, function (err, id) {
      if (err) throw err
      res.end(JSON.stringify({'handle': id}))
    })
  })
}

exports.login = function (req, res, opts, cb) {
  jsonBody(req, res, function (err, body) {
    if (err) {
      res.statusCode = 500
      return res.end("NO U")
    }
  })
}

exports.callback = function (req, res) {
  res.end('no callback')
}