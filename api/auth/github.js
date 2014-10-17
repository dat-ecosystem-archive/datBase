var request = require('request')

var config = require('../../config')
var models = require('../models.js')

githubOAuth = require('github-oauth')({
  githubClient: config['GITHUB_CLIENT'],
  githubSecret: config['GITHUB_SECRET'],
  baseURL: config['DAT_REGISTRY_HOST'] || 'http://localhost:5000',
  loginURI: '/auth/login',
  callbackURI: '/auth/callback',
  scope: 'user' // optional, default scope is set to user
})

githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})

githubOAuth.on('token', function(token, serverResponse) {
  var params = {
    url: 'https://api.github.com/user?access_token=' + token.access_token,
    headers: {
        'User-Agent': 'datproject.dat-registry'
    },
    json: true
  }

  function callback(err, response, body) {
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

  if (!token.access_token) {
    serverResponse.end('improper access token')
  }
  else {
    request(params, callback)
  }
})

module.exports = githubOAuth