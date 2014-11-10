var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var Router = require('routes-router')
var jsonBody = require("body")
var debug = require('debug')('server')
var levelSession = require('level-session')

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
  self.session = levelSession({
    db: self.models.db,
    cookieName: 'dat-registry'
  })
  self.router = self.createRoutes()
  self.server = http.createServer(function(req, res) {
    self.session(req, res, function() {
      req.session.get('user', function(err, userid) {
        if (!err) {
          req.user = userid
        }
        self.router(req, res)
      })
    })
  })
}

Server.prototype.createRoutes = function() {
  var self = this

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
      self.session.close()
    }
  })

  router.addRoute('/', this.index)

  // Authentication
  var provider = auth(this.models, this.session)
  router.addRoute('/auth/login', provider.login)
  router.addRoute('/auth/callback', provider.callback)
  router.addRoute('/auth/logout', provider.logout)
  router.addRoute('/auth/currentuser', function (req, res) {
    if (!req.user) {
      res.end('no current user')
    }
    res.end(JSON.stringify(req.user))
  })

  // Wire up API endpoints
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