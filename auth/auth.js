// Each auth provider should have login & callback as 
// available static functions on the exported module
// 
// Provider is picked by a query string, '?provider='


var githubOAuth = require('./github')

_getProvider = function(providerName) {
  // always returns github right now.
  // TODO: add more providers than just github
  return githubOAuth
}

exports.login = function(req, res, opts) {
  return _getProvider(opts.provider).login(req, res)
}

exports.callback = function(req, res, opts) {
  return _getProvider(opts.provider).callback(req, res)
}

exports.logout = function(req, res, opts) {
  return 'logout'
}
