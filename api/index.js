var fs = require('fs')
var path = require('path')
var http = require('http')
var extend = require('extend')
var Router = require('routes-router')
var jsonBody = require("body")
var bytewise = require('bytewise/hex')
var level = require('level-prebuilt')
var levelSession = require('level-session')
var sublevel = require('level-sublevel')
var Secondary = require('level-secondary')
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
    self.db = level(self.options.DAT_REGISTRY_DB, {
      keyEncoding: bytewise,
      valueEncoding: 'json'
    })
  }
  
  // sublevel-ify the db
  self.originalDb = self.db
  self.db = sublevel(self.db)
    
  self.session = levelSession({
    db: self.db.sublevel('sessions'),
    cookieName: 'dat-registry',
    ttl: {
      sub: self.db.sublevel('ttl')
    }
  })
  
  self.models = self.createModels()
  self.router = self.createRoutes(self.options)
  self.server = http.createServer(self.routeProvider.bind(self))
}

Server.prototype.close = function(cb) {
  var self = this
  // HACK because of https://github.com/dominictarr/level-sublevel/issues/78
  self.originalDb.close(function closeDb(err) {
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
    req.session.get('userid', function(err, userid) {
      if (!err) {
        req.userid = userid
      }
      self.router(req, res)
    })
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
    if (req.userid) {
      self.models.users.get(req.userid, function (err, user) {
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

  // Models
  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    res.setHeader('content-type', 'application/json')
    var id = parseInt(opts.params.id) || opts.params.id
    var model = self.models[opts.params.model]
    
    if (!model) {
      res.statusCode = 400
      response.json({error: 'Model not found'}).pipe(res)
      return 
    }
    
    var method = req.method.toLowerCase()
    
    // disallow user creation
    if (method === 'post' && opts.params.model === 'users') {
      var code = 403
      res.statusCode = code
      response.json({status: 'error', error: 'action not allowed'}).pipe(res)
      return
    }
    
    var params = {}
    if (id) params.id = id
    
    model.handler.dispatch(req, params, function(err, data) {
      if (err) {
        var code = 400
        if (err.notFound) code = 404
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

  return router
}

Server.prototype.createModels = function(opts) {
  var models = {
    users: users(this.db.sublevel('users'), opts),
    metadat: metadat(this.db.sublevel('metadat'), opts)
  }
  
  // initialize rest parsers for each model
  models.users.handler = restParser(models.users)
  models.metadat.handler = restParser(models.metadat)
  
  models.users.byGithubId = Secondary(this.db.sublevel('users'), 'title')
  
  return models
}
