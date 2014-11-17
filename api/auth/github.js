var githubOAuth = require('github-oauth')
var request = require('request')
var extend = require('extend')
var debug = require('debug')('github-provider')
var redirecter = require('redirecter')
var waterfall = require('run-waterfall')

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
            throw new Error('Could not log you in with github.')
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
    models.users.get(user.id, function (err) {
      if (err) {
        var newUser = {
          id: user.id,
          password: 'password',
          handle: user.login,
          data: user
        }
        models.users.create(newUser, function (err, id) {
          if (err) {
            debug('cannot create user in database', newUser)
            return callback(err)
          }
          return callback(null, newUser)
        })
      }
      return callback(null, user)
    })
  }

  function loginUser(req, user, callback) {
    // delete current session and set new session
    req.session.del('userid', function (err) {
      if (err) return callback(err)
      req.session.set('userid', user.id, function(err) {
        if (err) return callback(err)
        return callback(null)
      })
    })
  }
  return gh
}
