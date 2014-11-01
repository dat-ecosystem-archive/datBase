var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var Router = require('routes-router')
var jsonBody = require("body")
var debug = require('debug')('server')

var auth = require('./auth/index.js')
var defaults = require('./defaults.js')
var createModels = require('./models')

module.exports = Server

function Server(overrides) {
  // allow either new Server() or just Server()
  var self = this

  if (!(self instanceof Server)) return new Server(overrides)
  self.options = extend({}, defaults, overrides)

  self.models = createModels(self.options)
  self.router = self.createRoutes()
  self.server = http.createServer(self.router)
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
    },
    tearDown: function (req, res) {

    }
  })

  router.addRoute('/', this.index)

  // Authentication
  var provider = auth(this.models)
  router.addRoute('/auth/login/', provider.login)
  router.addRoute('/auth/callback', provider.callback)
  router.addRoute('/auth/logout/', provider.logout)

  // Wire up API endpoints
  var self = this
  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    var id = opts.params.id || ''
    var model = opts.params.model
    self.models[model].dispatch(req, res, id)
  })

  return router
}

Server.prototype.index = function(req, res) {
  res.end(fs.readFileSync('./index.html').toString())
}