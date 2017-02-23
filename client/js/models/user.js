const api = require('../api')()
const xtend = require('xtend')

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
    update: (state, data) => {
      return xtend(state, data)
    },
    sidePanel: (state, data) => {
      return {sidePanel: state.sidePanel === 'hidden' ? '' : 'hidden'}
    },
    loginPanel: (state, showPanel) => {
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
    dats: (state, data, send, done) => {
      console.log(state, data)
      api.dats.get({username: data.username}, function (err, resp, json) {
        if (err || resp.statusCode !== 200) return done()
        send('user:update', {dats: json}, done)
      })
    },
    whoami: (state, data, send, done) => {
      const user = api.whoami()
      if (user) {
        send('user:update', user, function () {
          send('user:dats', user, done)
        })
      } else done()
    },
    logout: (state, data, send, done) => {
      api.logout(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        var newState = {
          username: null,
          email: null,
          sidePanel: 'hidden',
          token: null
        }
        send('user:update', newState, function () {
          send('message:success', 'Logged out.', done)
        })
      })
    },
    login: (state, data, send, done) => {
      api.login(data, function (err, resp, data) {
        if (err) return send('error:new', err, done)
        data.login = 'hidden'
        send('user:update', data, function () {
          send('message:success', 'Logged in successfully.', done)
          window.location.href = '/install'
        })
      })
    },
    register: (state, data, send, done) => {
      api.register(data, function (err, resp, data) {
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
