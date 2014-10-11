var http = require('http')
var debug = require('debug')('server')
var Router = require('routes-router')
var Auth = require('./auth/auth')

module.exports = Server

function Server() {
  this.auth = Auth()
}

Server.prototype.createRoutes = function() {
  var router = Router()
  router.addRoute('/login/', this.auth.login)
  router.addRoute('/auth-callback/', this.auth.callback)
  router.addRoute('/logout/', this.auth.logout)
  return router
}

Server.prototype.listen = function (port) {
  var router = this.createRoutes()
  var server = http.createServer(router)
  server.listen(port)
  console.log('listening on port ' + port)
}

