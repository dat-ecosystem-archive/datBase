var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var Router = require('routes-router')
var jsonBody = require("body")
var debug = require('debug')('server')

var auth = require(path.join(__dirname, 'auth', 'index.js'))
var defaults = require(path.join(__dirname, 'defaults.js'))
var createModels = require(path.join(__dirname, 'models.js'))

module.exports = Server

function Server(overrides) {
  // allow either new Server() or just Server()
  if (!(this instanceof Server)) return new Server(overrides)
  this.options = extend({}, defaults, overrides)
  
  this.models = createModels()
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
  var provider = auth(this.models)
  router.addRoute('/auth/create/', {POST: provider.create})
  router.addRoute('/auth/login/', provider.login)
  router.addRoute('/auth/callback', provider.callback)
  router.addRoute('/auth/logout/', provider.logout)

  return router
}

Server.prototype.index = function(req, res) {
  res.end(fs.readFileSync('./index.html').toString())
}