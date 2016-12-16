var township = require('township-client')
var defaultState = {
  username: null,
  email: null,
  token: null,
  login: 'hidden'
}

function getClient () {
  return township({
    server: window.location.origin + '/api/v1'
  })
}

module.exports = {
  namespace: 'user',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    update: (data, state) => {
      return data
    },
    showLogin: (data, state) => {
      return {login: ''}
    },
    hideLogin: (data, state) => {
      return {login: 'hidden'}
    }
  },
  subscriptions: {
    checkUser: function (state, send) {
      setInterval(function () {
        if (!state.user) send('user:whoami', {})
      }, 5000)
    }
  },
  effects: {
    whoami: (data, state, send, done) => {
      const client = getClient()
      var user = client.getLogin()
      if (user) send('user:update', user, done)
      else done()
    },
    login: (data, state, send, done) => {
      const client = getClient()
      client.login(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        data.login = 'hidden'
        send('user:update', data, function () {
          send('message:success', 'Logged in successfully.', done)
        })
      })
    },
    register: (data, state, send, done) => {
      const client = getClient()
      client.register(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        send('user:update', data, function () {
          send('message:success', 'Registered successfully.', done)
        })
      })
    }
  }
}
