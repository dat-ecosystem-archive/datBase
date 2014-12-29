var githubOAuth = require('github-oauth')
var request = require('request')
var extend = require('extend')
var redirecter = require('redirecter')
var waterfall = require('run-waterfall')
var debug = require('debug')('github-provider')

var defaults = require('../defaults.js')

module.exports = function(models, overrides) {
  var options = {
    githubClient: defaults['GITHUB_CLIENT'],
    githubSecret: defaults['GITHUB_SECRET'],
    baseURL: defaults['DAT_REGISTRY_HOST'] || 'http://localhost:5000',
    loginURI: '/auth/login',
    callbackURI: '/auth/callback',
    scope: 'user' // optional, default scope is set to user
  }

  var gh = githubOAuth(extend({}, options, overrides))

  gh.on('error', function(err) {
    console.error('there was a login error', err)
  })

  gh.on('token', function(token, res, tokenResponse, req) {
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

    function githubUserDataCallback(err, response, body) {
      debug('github user data response', {
        status: response.statusCode,
        body: body
      })
      if (err) throw err

      waterfall([
        function (callback) {
          getOrCreateGithubUser(body, callback)
        },
        function (user, callback) {
          loginUser(req, user, callback)
        }
      ],
        function (err) {
          //the finisher
          var type, text;
          if (err) {
            throw err
          }
          debug('redirecting')
          redirecter(req, res, '/')
        }
      )
    }
  })

  function getOrCreateGithubUser(user, callback) {
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
        password: 'password', // dummy password.
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
      models.users.accounts.create(newUser.handle, function (err) {
        if (err) {
          debug('cannot create user in database', newUser)
          return callback(err)
        }
        models.users.accounts.put(newUser.handle, function (err) {
          if (err) return cb(err)
          models.users.byGithubId.put(newUser.githubId, newUser.handle, function (err) {
            if (err) return cb(err)
            debug('new user created')
            return callback(null, newUser)
          })
        })
      })
    })
  }

  function loginUser(req, user, callback) {
    // delete current session and set new session
    req.session.del('userid', function (err) {
      if (err) return callback(err)
      req.session.set('userid', user.handle, function(err) {
        if (err) return callback(err)
        return callback(null)
      })
    })
  }
  
  function getByGithubId(id, cb) {
    models.users.byGithubId.get(id, function (err, userId) {
      if (err) return cb(err)
      models.users.get({id: userId}, cb)
    })
  }
  
  return gh
}
