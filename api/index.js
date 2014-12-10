var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var Router = require('routes-router')
var jsonBody = require("body")
var debug = require('debug')('server')
var levelSession = require('level-session')
var redirecter = require('redirecter')
var Ractive = require('ractive');
var sendJson = require('send-data/json')

var Auth = require('./auth/index.js')
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
  self.router = self.createRoutes(self.options)
  self.server = http.createServer(function(req, res) {
    console.log(req.url)
    self.session(req, res, function() {
      req.session.get('userid', function(err, userid) {
        if (!err) {
          req.userid = userid
        }
        self.router(req, res)
      })
    })
  })
}

Server.prototype.createRoutes = function (options) {
  var self = this

  var router = Router({
    errorHandler: function (req, res, err) {
      console.trace(err)
      sendJson(req, res, {
        'status': 'error',
        'message': err.message
      })
    },
    notFound: function (req, res) {
      res.end(fs.readFileSync('./index.html').toString())
    }
  })

  // Authentication
  var auth = Auth(this.models, options.auth)
  router.addRoute('/auth/login', auth.login)
  router.addRoute('/auth/callback', auth.callback)
  router.addRoute('/auth/logout', auth.logout)
  router.addRoute('/auth/currentuser', function (req, res) {
    if (req.userid) {
      self.models.users.get(req.userid, function (err, user) {
        delete user['password']
        sendJson(req, res, {
          'status': 'success',
          'user': user
        });
      })
    } else {
      sendJson(req, res, {
        'status': 'warning',
        'message': 'No current user.'
      });
    }
  })

  // Wire up API endpoints
  router.addRoute('/api/:model/:id?', function(req, res, opts, cb) {
    var id = parseInt(opts.params.id) || opts.params.id || ''
    var model = self.models[opts.params.model]
    if (!model) {
      return cb(new Error('no model'))
    }
    model.dispatch(req, res, id, cb)
  })

  return router
}

