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
var redirecter = require('redirecter')
var cookieAuth = require('cookie-auth')
var debug = require('debug')('server')

var defaults = require('./defaults.js')
var githubAuth = require('./auth/github.js')
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

  self.sessions = cookieAuth({name: 'dathub'})
  self.models = self.createModels()
  self.router = self.createRoutes(self.options)
  self.server = http.createServer(function(req, res) {
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

Server.prototype.createRoutes = function (options) {
  var self = this

  var router = Router({
    errorHandler: function (req, res, err) {
      console.trace('Router error', err)
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
  self.auth = {
    github: githubAuth(this.models, this.sessions)
  }
    
  router.addRoute('/auth/github/login', self.auth.github.oauth.login)
  router.addRoute('/auth/github/callback', self.auth.github.oauth.callback)
  router.addRoute('/auth/logout', function(req, res, opts) {
    return self.sessions.logout(req, res)
  })
  router.addRoute('/auth/currentuser', function (req, res) {
    self.sessions.getSession(req, function(err, session) {
      if (session) {
        self.models.users.get(session.session, function (err, user) {
          if (err) {
            response.json({
              'status': 'warning',
              'message': err.message
            }).pipe(res)
            return
          }
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
      if (err) return unauthorized(res)
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
      
        // if put or post then `data` should look like {created: bool, data: row}
        if (method === 'put' || method === 'post') {
          res.statusCode = data.created ? 201 : 200
          // TODO should we treat validation errors as a 200 or a 4xx?
          if (data.status && data.status === 'error') {
            res.statusCode = 200
            response.json(data).pipe(res)
            return
          }
          response.json(data.data).pipe(res)
          return
        }

        // should never get here
        debug('unknown model method', method)
        res.end()
      })      
    })
    
  })
  
  function ensurePermissions(req, res, opts, cb) {
    var method = req.method.toLowerCase()
  
    // check the session
    self.sessions.getSession(req, function(sessionErr, session) {
      if (sessionErr) {
        if (method !== 'get') return cb(new Error('action not allowed'))
        else return cb(null, {}) // let GETs through even if logged out
      }
      // get profile
      self.models.users.get({id: session.data.id}, function (profileErr, profile) {
        var userData =  {session: session, user: profile}
        
        // let GETs through
        if (method === 'get') return cb(null, userData)

        // otherwise require account for access
        if (profileErr) return cb(new Error('action not allowed'))

        // check if model has specific authorization rules and use those
        var model = self.models[opts.params.model]
        if (model && model.authorize) return model.authorize(opts.params, userData, cb)
        
        // otherwise return the userData
        return cb(null, userData)
      })
    })
  }

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

function unauthorized(res) {
  var code = 401
  res.statusCode = code
  response.json({status: 'error', error: 'action not allowed'}).pipe(res)
}

