var path = require('path')
var githubProvider = require('./github.js')

// TODO pass in overrides
module.exports = function(models) {
  var provider = githubProvider(models)

  return {
    login: function(req, res, opts) {
      provider.login(req, res)
    },
    callback: function(req, res, opts) {
      provider.callback(req, res)
    },
    logout: function(req, res, opts) {
      logout(req, res, opts)
    }
  }
}

function logout(req, res, opts) {
  req.session.del('user', function (err) {
    if (err) throw err
    res.end('logged out')
  })
}