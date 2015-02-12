var githubOAuth = require('github-oauth')
var request = require('request')
var extend = require('extend')
var redirecter = require('redirecter')
var response = require('response')
var debug = require('debug')('github-provider')

var defaults = require('../defaults.js')

module.exports = Github

function Github(models, sessions, overrides) {
  if (!(this instanceof Github)) return new Github(models, sessions, overrides)

  var self = this

  var options = {
    githubClient: defaults['GITHUB_CLIENT'],
    githubSecret: defaults['GITHUB_SECRET'],
    baseURL: defaults['DAT_REGISTRY_HOST'] || 'http://localhost:5000',
    loginURI: '/auth/github/login',
    callbackURI: '/auth/github/callback',
    scope: 'user' // optional, default scope is set to user
  }

  this.options = extend({}, options, overrides)
  this.models = models
  this.oauth = githubOAuth(this.options)

  this.oauth.on('error', function(err) {
    console.error('there was a login error', err)
  })

  this.oauth.on('token', function(token, res, tokenResponse, req) {
    var params = {
      url: 'https://api.github.com/user?access_token=' + token.access_token,
      headers: {
          'User-Agent': 'datproject.dat-registry'
      },
      json: true
    }

    if (!token.access_token) {
      res.end('improper access token')
    } else {
      request(params, githubUserDataCallback)
    }

    function githubUserDataCallback(err, dataResponse, body) {
      debug('github user data response', {
        status: dataResponse.statusCode,
        body: body
      })

      if (err) return response.json({
        'status': 'error',
        'message': err.message
      }).pipe(res)

      self.getOrCreate(body, function (err, newUser) {
        if (err) return response.json({
          'status': 'error',
          'message': err.message
        }).pipe(res)

        // delete current session (if one exists)
        sessions.delete(req, function(err) {
          // ignore error
          // create session
          sessions.login(res, {id: newUser.handle}, function(err, session) {
            if (err) return response.json({
              'status': 'error',
              'message': err.message
            }).pipe(res)
            debug('redirecting')
            redirecter(req, res, '/profile')
          })
        })
      })
    }
  })
}

Github.prototype.getOrCreate = function(user, callback) {
  var self = this
  // get or create user
  debug('getting user', user)

  getByGithubId(user.id, function (err, existingUser) {
    if (existingUser) {
      debug('user exists', existingUser)
      return callback(null, existingUser)
    }
    // user doesn't exist, so we create a new one
    var newUser = {
      handle: user.login,
      githubId: user.id,
      data: {
        email: user.email,
        name: user.name,
        location: user.location,
        bio: user.bio,
        blog: user.blog,
        company: user.company,
        login: user.login
      }
    }
    debug('creating new user', newUser)
    self.models.users.accounts.create(newUser.handle, {value: newUser}, function (err) {
      if (err) {
        debug('cannot create user in database', newUser)
        return callback(err)
      }
      debug('created user account', newUser.handle)
      self.models.users.byGithubId.put(newUser.githubId, newUser.handle, function (err) {
        if (err) return callback(err)
        debug('new user created')
        return callback(null, newUser)
      })
    })
  })

  function getByGithubId(id, cb) {
    self.models.users.byGithubId.get(id, function (err, userId) {
      if (err) return cb(err)
      self.models.users.get({id: userId}, cb)
    })
  }
}
