var github = require('github')

module.exports = Auth

var providers = {
  "github": github
}

function Auth() {}

Auth.prototype.login = function (req, res, opts) {
  var provider = providers[opts.provider]
  provider.login(req, res)
}

Auth.prototype.logout = function (req, res, opts) {
  var provider = providers[opts.provider]
  provider.callback(req, res)
}