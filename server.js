var http = require('http')
var debug = require('debug')('server')
var Router = require('routes-router')
var Auth = require('./auth/auth')

module.exports = Server

var Server = function() {}

Server.prototype.createRoutes = function() {
  var router = Router()
  router.addRoute('/login/', Auth.login)
  router.addRoute('/auth-callback/', Auth.callback)
  router.addRoute('/logout/', Auth.logout)
  return router
}

Server.prototype.listen = function (port) {
  var router = this.createRoutes()
  var server = http.createServer(router)
  server.listen(port)
  debug("listening on port " + port)
}

