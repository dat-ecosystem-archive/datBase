var github = require('github-oauth')({
  githubClient: process.env['GITHUB_CLIENT'],
  githubSecret: process.env['GITHUB_SECRET'],
  baseURL: process.env['DAT_REGISTRY_HOSTNAME'] || 'http://localhost:5000',
  loginURI: '/login',
  callbackURI: '/auth-callback',
  scope: 'user' // optional, default scope is set to user
})

github.on('error', function(err) {
  console.error('there was a login error', err)
})

github.on('token', function(token, serverResponse) {
  console.log('here is your shiny new github oauth token', token)
  serverResponse.end(JSON.stringify(token))
})

module.exports = github
