var http = require('http')
var debug = require('debug')('index')

function Routes(req) {
  if (req.url.match(/login/)) return github.login(req, res)
  if (req.url.match(/callback/)) return github.callback(req, res)
}