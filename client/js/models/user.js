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
  effects: {
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
