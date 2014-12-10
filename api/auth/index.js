var path = require('path')
var githubProvider = require('./github.js')
var redirecter = require('redirecter')

module.exports = function(models, opts) {
  var provider = githubProvider(models)
  if (opts) {
    if (opts.provider) {
      provider = opts.provider
    }
  }

  return {
    login: function(req, res, opts) {
      provider.login(req, res)
    },
    callback: function(req, res, opts) {
      provider.callback(req, res)
    },
    logout: function(req, res, opts) {
      req.session.del('userid', function (err) {
        if (err) {
          return callback(err)
        }
        req.session.set('message', {
            'type': 'success',
            'text': 'You have successfully logged out!'
          }, function () {
            redirecter(req, res, '/')
        })
      })
    },
  }
}