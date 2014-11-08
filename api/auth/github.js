var githubOAuth = require('github-oauth')
var request = require('request')
var extend = require('extend')
var debug = require('debug')('github-provider')
var uuid = require('uuid')

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
      var random = uuid.v1()

      var userData = {
        handle: body.login,
        password: random,
        email: body.email,
        data: {
          token: token.access_token,
          account: body
        }
      }

      models.users.create(userData, function (err, id) {
        if (err) {
          debug('cannot create user in database', userData)
          throw err
        }
        models.users.login(id, random, function (err, user) {
          if (err) {
            debug('cannot login user', id)
            res.end('bad credentials')
          }

          req.session.del('user', function (err) {
            if (err) throw err
            req.session.set('user', user.id, function(err) {
              if (err) throw err
              //  prevent transmission of sensitive plain-text info to client
              delete user['password']
              res.end(JSON.stringify({"user": user}))
            })
          })

        })
      })
    }
  })

  return gh
}
