var path = require('path')
var EMailProvider = require('./email.js')
var githubProvider = require('./github.js')

// TODO pass in overrides
module.exports = function(models) {
  var provider = githubProvider(models)
  var emailProvider = new EMailProvider(models)

  // also make the email provider accessible to the consumer (TODO restructure this)
  provider.emailProvider = emailProvider

  return {
    create: emailProvider.create.bind(emailProvider),
    login: function(req, res, opts) {
      provider.login(req, res)
    },
    callback: function(req, res, opts) {
      provider.callback(req, res)
    },
    logout: logout
  }
}

function logout(req, res, opts) {
  res.end('TODO')
}