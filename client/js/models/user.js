var Auth0 = !module.parent ? require('auth0-js') : null
var defaultState = {
  username: null
}

var client
if (!module.parent) {
  client = new Auth0({
    domain: 'publicbits.auth0.com',
    clientID: 'DWrTFyyzp3QZq8S3PZ5dfJd3T8xNf5kY'
  })
}

var noop = function () {}

module.exports = {
  namespace: 'user',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    logout: (data, state) => {
      localStorage.setItem('idToken', null)
      return { profile: null }
    },
    update: (data, state) => {
      return {
        profile: data.profile || state.profile
      }
    }
  },
  subscriptions: [
    function (send, done) {
      client.on('authenticated', function (authResult) {
        // Use the token in authResult to getProfile() and save it to localStorage
        client.getProfile(authResult.idToken, function (error, profile) {
          if (error) {
            send('user:update', {logging_in: false, error}, done)
          } else {
            send('user:update', {logging_in: false, profile}, done)
          }
          localStorage.setItem('idToken', authResult.idToken)
          send('user:update', {profile})
        })
      })
    }
  ],
  effects: {
    login: (data, state, send, done) => {
      send('user:update', {logging_in: true}, noop)
      lock.show()
    }
  }
}
