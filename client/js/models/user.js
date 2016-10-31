var Auth0 = !module.parent ? require('auth0-js') : null

var defaultState = {
  username: null,
  idToken: null,
  connection: 'datland-dev'
}

var client
if (!module.parent) {
  client = new Auth0({
    domain: 'publicbits.auth0.com',
    clientID: 'DWrTFyyzp3QZq8S3PZ5dfJd3T8xNf5kY',
    callbackURL: 'http://localhost:8080/user/callback'
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
      return data
    }
  },
  effects: {
    login: (data, state, send, done) => {
      send('user:update', {logging_in: true}, noop)
      client.login({
        username: data.username,
        password: data.password,
        connection: state.connection,
        scope: 'openid email color food'
      }, function (err) {
        if (err) console.error(err)
      })
    },
    getProfile: (data, state, send, done) => {
      client.getProfile(state.idToken, function (error, profile) {
        if (error) {
          send('user:update', {logging_in: false, error}, done)
        } else {
          send('user:update', {logging_in: false, profile}, done)
        }
        localStorage.setItem('idToken', state.idToken)
        send('user:update', {profile})
      })
    }
  }
}
