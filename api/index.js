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
  self.router = self.createRoutes()
  self.server = http.createServer(function(req, res) {
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

Server.prototype.createRoutes = function() {
  var self = this

  var router = Router({
    errorHandler: function (req, res) {
      req.session.set('message', {
          'type': 'error',
          'text': '500: There has been a grave server error. Please open an issue on github.'
        }, function () {
          redirecter(req, res, '/')
      })
    },
    notFound: function (req, res) {
      req.session.set('message', {
          'type': 'error',
          'text': '404: No dats.'
        }, function () {
          redirecter(req, res, '/')
      })
    }
  })

  router.addRoute('/', this.dispatch('./templates/splash.html'))
  router.addRoute('/about', this.dispatch('./templates/about.html'))


  // Authentication
  var auth = Auth(this.models)
  router.addRoute('/auth/login', auth.login)
  router.addRoute('/auth/callback', auth.callback)
  router.addRoute('/auth/logout', auth.logout)

  router.addRoute('/profile', function (req, res, opts, cb) {
    self.models.users.get(req.userid, function (err, user) {
      restrictToSelf(req, res, user, function (err) {
        if (err) return cb(err)
        render(req, res, './templates/profile.html', {user: user})
      })
    })
  })

  router.addRoute('/restricted', function (req, res) {
    render(req, res, './templates/system/restricted.html')
  })

  // Wire up API endpoints
  router.addRoute('/api/:model/:id?', function(req, res, opts) {
    var id = opts.params.id || ''
    var model = opts.params.model
    self.models[model].dispatch(req, res, id)
  })

  return router
}

Server.prototype.dispatch = function(location) {
  var self = this
  return function (req, res) {
    if (req.userid) {
      // TODO: hits the database if we have a user.. every time..
      self.models.users.get(req.userid, function (err, user) {
        if (err) return cb(err)
        render(req, res, location, {user: user})
      })
    } else {
        render(req, res, location, {user: null})
    }
  }
}

function render(req, res, location, data) {
  var index = fs.readFileSync('./index.html').toString()
  data['content'] = new Ractive({
    template: fs.readFileSync(location).toString(),
    data: data
  }).toHTML()

  req.session.get('message', function (err, message) {

    data['message'] = message

    req.session.del('message', function (err) {
      var template =  new Ractive({
        template: index,
        data: data
      });
      return res.end(template.toHTML())
    })
  })
}

function restrictToSelf(req, res, user, callback) {
  req.session.get("userid", function (err, authedUser) {
    if (err) {
      return callback(err)
    }
    if (user && user.id === authedUser) {
      return callback()
    }
    req.session.set('message', {
        'type': 'error',
        'text': 'Silly cat, this dat is not for you.'
      }, function (err) {
        if (err) {
          return callback(err)
        }
        redirecter(req, res, '/')
    })
  })
}
