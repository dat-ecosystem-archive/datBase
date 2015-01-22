var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var level = require('level-prebuilt')
var subdown = require('subleveldown')
var cookieAuth = require('cookie-auth')
var debug = require('debug')('server')

var defaults = require('./defaults.js')
var githubAuth = require('./auth/github.js')
var createModels = require('./models')
var createRoutes = require('./routes')

module.exports = Server

function Server(overrides) {
  // allow either new Server() or just Server()
  if (!(this instanceof Server)) return new Server(overrides)
  var self = this
  self.options = extend({}, defaults, overrides)
  
  // allow custom db to be passed in
  if (self.options.db) {
    self.db = self.options.db
  } else {
    self.db = level(self.options.DAT_REGISTRY_DB)
  }

  self.sessions = cookieAuth({name: 'dathub', sessions: subdown(this.db, 'sessions')})
  self.models = createModels(self.db)
  self.auth = { github: githubAuth(this.models, this.sessions) }
  self.router = createRoutes(self)
  self.server = self.createServer()
}

Server.prototype.createServer = function() {
  var self = this
  return http.createServer(function(req, res) {
    debug(req.method, req.url)
    self.router(req, res)
  })
}

Server.prototype.close = function(cb) {
  var self = this
  self.db.close(function closedDb(err) {
    if (err) return cb(err)
    self.server.close(cb)
  })
}
