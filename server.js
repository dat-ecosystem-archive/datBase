var http = require('http')
var debug = require('debug')('server')
var Router = require('routes-router')
var auth = require('./auth/auth')

module.exports = Server

function Server(opts) {}

Server.prototype.createRoutes = function() {
  var router = Router({
    errorHandler: function (req, res) {
      res.statusCode = 500
      res.end("no u")
    },
    notFound: function (req, res) {
      res.statusCode = 404
      res.end("oh noes")
    }
  })

  // Authentication
  router.addRoute('/auth/login/', auth.login)
  router.addRoute('/auth/callback/', auth.callback)
  router.addRoute('/auth/logout/', auth.logout)

  return router
}
Server.prototype.listen = function (port) {
  var router = this.createRoutes()
  var server = http.createServer(router)
  server.listen(port)
  console.log('listening on port ' + port)
}

