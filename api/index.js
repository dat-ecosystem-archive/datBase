var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var Router = require('routes-router')
var jsonBody = require("body")
var level = require('level-prebuilt')
var subdown = require('subleveldown')
var redirecter = require('redirecter')
var Ractive = require('ractive')
var Corsify = require("corsify")
var restParser = require('rest-parser')
var response = require('response')
var debug = require('debug')('server')

var defaults = require('./defaults.js')
var Auth = require('./auth/index.js')
var metadat = require('./models/metadat.js')
var users = require('./models/users.js')

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

  self.models = self.createModels()
  self.router = self.createRoutes(self.options)
  self.server = http.createServer(self.routeProvider.bind(self))
}

Server.prototype.close = function(cb) {
  var self = this
  self.db.close(function closeDb(err) {
    if (err) return cb(err)
    self.session.close(function closeSession(err) {
      if (err) return cb(err)
      self.server.close(cb)
    })
  })
}

Server.prototype.routeProvider = function(req, res) {
  var self = this
  console.error(req.method, req.url)
  self.session(req, res, function() {
    self.router(req, res)
  })
}

Server.prototype.createRoutes = function (options) {
  var self = this

  var router = Router({
    errorHandler: function (req, res, err) {
      console.trace(err)
      response.json({
        'status': 'error',
        'message': err.message
      }).pipe(res)
    },
    notFound: function (req, res) {
      debug('not found', req.url)
      res.statusCode = 404
      res.end('not found')
    }
  })
  
  // Authentication
  var auth = Auth(this.models, options.auth)
  router.addRoute('/auth/login', auth.login)
  router.addRoute('/auth/callback', auth.callback)
  router.addRoute('/auth/logout', auth.logout)
  router.addRoute('/auth/currentuser', function (req, res) {
    req.session.get('userid', function(err, userid) {
      if (userid) {
        self.models.users.get(userid, function (err, user) {
          delete user['password']
          response.json({
            'status': 'success',
            'user': user
          }).pipe(res)
        })
      } else {
        response.json({
          'status': 'warning',
          'message': 'No current user.'
        }).pipe(res)
      }
    })
  })

  // Models
  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    res.setHeader('content-type', 'application/json')
    var id = opts.params.id
    var model = self.models[opts.params.model]
    
    if (!model) {
      res.statusCode = 400
      response.json({error: 'Model not found'}).pipe(res)
      return 
    }
    
    var method = req.method.toLowerCase()
    var params = {}
    if (id) params.id = id
      
    ensurePermissions(req, res, opts, function(err) {
      if (err) return disallow(res)
      model.handler.dispatch(req, params, function(err, data) {
        if (err) {
          var code = 400
          if (err.notFound) code = 404
          if (err.statusCode) code = err.statusCode
          res.statusCode = code
          response.json({status: 'error', error: err.message}).pipe(res)
          return
        }
      
        if (!data) data = {status: 'error', error: 'no data returned'}
            
        if (method === 'get' || method === 'delete') {
          res.statusCode = 200
          response.json(data).pipe(res)
          return
        }
      
        if (method === 'put' || method === 'post') {
          res.statusCode = 201
          // TODO should we treat validation errors as a 200 or a 4xx?
          if (data.status && data.status === 'error') res.statusCode = 200
          response.json(data).pipe(res)
          return
        }

        // should never get here
        debug('unknown model method', method)
        res.end()
      })      
    })
    
  })

  return router
}

Server.prototype.createModels = function(opts) {
  var usersDb = subdown(this.db, 'users', {valueEncoding: 'json'})
  var metadatDb = subdown(this.db, 'metadat', {valueEncoding: 'json'})
  
  var models = {
    users: users(usersDb, opts),
    metadat: metadat(metadatDb, opts)
  }
  
  // initialize rest parsers for each model
  models.users.handler = restParser(models.users)
  models.metadat.handler = restParser(models.metadat)
  
  // TODO replace with a more proper secondary indexing solution
  models.users.byGithubId = subdown(this.db, 'githubId')
  
  return models
}

function disallow(res) {
  var code = 403
  res.statusCode = code
  response.json({status: 'error', error: 'action not allowed'}).pipe(res)
}

function ensurePermissions(req, res, opts, cb) {
  var method = req.method.toLowerCase()
  
  // allow all GETs (assumes no side effects and no private data exposed over REST)
  if (method === 'get') return setImmediate(cb)
    
  // otherwise assumes side-effects, so check the session
  req.session.get('userid', function(err, userid) {
    if (err) return cb(err)
    if (!userid) return setImmediate(function() {
      cb(new Error('action not allowed'))
    })
    cb()
  })
}
