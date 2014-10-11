var githubOAuth = require('./github')

module.exports = function(opts) {

  var that = {}

  _getProvider = function(providerName) {
    // always returns github right now.
    // TODO: add more providers than just github
    return githubOAuth
  }

  that.login = function(req, res, opts) {
    return _getProvider(opts.provider).login(req, res)
  }

  that.callback = function(req, res, opts) {
    return _getProvider(opts.provider).callback(req, res)
  }

  that.logout = function(req, res, opts) {
    return 'logout'
  }

  return that
}
