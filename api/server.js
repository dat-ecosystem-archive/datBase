var http = require('http')
var debug = require('debug')('server')
var Router = require('routes-router')
var fs = require('fs')
var jsonBody = require("body")

var auth = require('./auth/auth.js')

module.exports = Server

function Server(opts) {
  this.options = opts
  this.router = this.createRoutes()
  this.server = http.createServer(this.router)
}

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

  router.addRoute('/', this.index)

  // Authentication
  router.addRoute('/auth/create/', {POST: auth.create})
  router.addRoute('/auth/login/', auth.login)
  router.addRoute('/auth/callback', auth.callback)
  router.addRoute('/auth/logout/', auth.logout)

  return router
}

Server.prototype.index = function(req, res) {
  res.end(fs.readFileSync('./index.html').toString())
}