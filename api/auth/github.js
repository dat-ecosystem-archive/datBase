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
  request('https://api.github.com/user?access_token=' + token,
    function(error, response, body) {
      users.create({
        handle: response['login'],
        password: token,
        email: response['email'],
        token: token
      }, function (err, id) {
        serverResponse.end(JSON.stringify(id))
      })
  })
})

module.exports = githubOAuth