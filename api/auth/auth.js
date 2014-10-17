var emailProvider = require('./email.js')
var githubOAuth = require('./github.js')

exports.create = function(req, res, opts) {
  // create an account
  return emailProvider.create(req, res)
}

_getProvider = function(providerName) {
  // Each auth provider should have login & callback as
  // available static functions on the exported module
  // TODO: add more providers than just github
  return githubOAuth
}

exports.login = function(req, res, opts) {
  // login
  return _getProvider(opts.provider).login(req, res)
}

exports.callback = function(req, res, opts) {
  // callback for using 3rd-party providers
  return _getProvider(opts.provider).callback(req, res)
}

exports.logout = function(req, res, opts) {
  // logout
  return 'logout'
}

