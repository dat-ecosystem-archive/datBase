var config = require('../../config')

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
  request('https://api.github.com/user?access_token=' + token, function(error, response, body) {

  })
  serverResponse.end(JSON.stringify(token))
})

module.exports = githubOAuth