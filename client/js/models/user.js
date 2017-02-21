const api = require('dat-registry')

const defaultState = {
  username: null,
  email: null,
  token: null,
  login: 'hidden',
  register: 'hidden',
  sidePanel: 'hidden',
  dats: []
}

module.exports = {
  namespace: 'user',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.user,
  reducers: {
    update: (data, state) => {
      return data
    },
    sidePanel: (data, state) => {
      return {sidePanel: state.sidePanel === 'hidden' ? '' : 'hidden'}
    },
    loginPanel: (showPanel, state) => {
      return {login: showPanel ? '' : 'hidden'}
    }
  },
  subscriptions: {
    checkUser: function (send, done) {
      send('user:whoami', {}, done)
      setInterval(function () {
        send('user:whoami', {}, done)
      }, 5000)
    }
  },
  effects: {
    dats: (data, state, send, done) => {
      var client = api()
      client.dats.get({username: data.username}, function (err, resp, json) {
        if (err || resp.statusCode !== 200) return done()
        send('user:update', {dats: json}, done)
      })
    },
    whoami: (data, state, send, done) => {
      const client = api()
      const user = client.whoami()
      if (user) {
        send('user:update', user, done)
        send('user:dats', user, done)
      } else done()
    },
    logout: (data, state, send, done) => {
      const client = api()
      client.logout(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        state.username = null
        state.email = null
        state.sidePanel = 'hidden'
        state.token = null
        send('user:update', data, function () {
          send('message:success', 'Logged out.', done)
        })
      })
    },
    login: (data, state, send, done) => {
      const client = api()
      client.login(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        data.login = 'hidden'
        send('user:update', data, function () {
          send('message:success', 'Logged in successfully.', done)
          window.location.href = '/install'
        })
      })
    },
    register: (data, state, send, done) => {
      const client = api()
      client.register(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        data.register = 'hidden'
        send('user:update', data, function () {
          send('message:success', 'Registered successfully.', done)
          window.location.href = '/install'
        })
      })
    }
  }
}
