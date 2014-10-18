var githubOAuth = require('github-oauth')
var request = require('request')
var extend = require('extend')
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

  gh.on('token', function(token, serverResponse) {
    var params = {
      url: 'https://api.github.com/user?access_token=' + token.access_token,
      headers: {
          'User-Agent': 'datproject.dat-registry'
      },
      json: true
    }

    if (!token.access_token) {
      serverResponse.end('improper access token')
    } else {
      request(params, callback)
    }
    
    function callback(err, response, body) {
      debug('token verification response', {status: response.statusCode, body: body})
      // TODO don't throw
      if (err) throw err
      models.users.create({
        handle: body.login,
        password: token.access_token,
        email: body.email,
        github: {
          token: token.access_token,
          account: body
        }
      }, function (err, id) {
        if (err) throw err
        serverResponse.end(JSON.stringify({'handle': id}))
      })
    }
  })
  
  return gh
}
