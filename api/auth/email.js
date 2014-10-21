var level = require('level')
var jsonBody = require("body/json")

module.exports = EMail

function EMail(models) {
  this.models = models
}

EMail.prototype.create = function (req, res, opts, cb) {
  var self = this
  jsonBody(req, res, function (err, body) {
    if (err) {
      res.statusCode = 500
      return res.end("NO U")
    }
    self.models.users.create({
      handle: body.handle,
      password: body.password,
      email: body.email
    }, function (err, id) {
      if (err) throw err
      res.end(JSON.stringify({'handle': id}))
    })
  })
}

EMail.prototype.login = function (req, res, opts, cb) {
  jsonBody(req, res, function (err, body) {
    if (err) {
      res.statusCode = 500
      return res.end("NO U")
    }
  })
}

EMail.prototype.callback = function(req, res) {
  res.end('no callback')
}