const Auth0 = require('auth0')

var client = new Auth0.ManagementClient({
  domain: 'publicbits.auth0.com',
  token: 'super secret Auth0 token'
})

module.exports = {
  getProfile: client.users.get.bind(client.users)
}
