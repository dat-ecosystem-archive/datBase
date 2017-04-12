const api = require('../api')()
const xtend = require('xtend')

const defaultState = {
  username: null,
  id: null,
  email: null,
  token: null,
  register: 'hidden',
  sidePanel: 'hidden',
  passwordResetResponse: null,
  passwordResetConfirmResponse: null,
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
    passwordResetResponse: function (state, data) {
      return { passwordResetResponse: data }
    },
    passwordResetConfirmResponse: function (state, data) {
      return { passwordResetConfirmResponse: data, passwordResetResponse: null }
    }
  },
  subscriptions: {
    checkUser: function (send, done) {
      send('user:whoami', {}, done)
    }
  },
  effects: {
    dats: (state, user, send, done) => {
      api.users.get({username: user.username}, function (err, resp, json) {
        if (err && err.message === 'jwt expired') return send('user:logout', user, done)
        if (err || resp.statusCode !== 200) return done()
        if (!json.length) return done()
        api.dats.get({user_id: json[0].id}, function (err, resp, json) {
          if (err && err.message === 'jwt expired') return send('user:logout', user, done)
          if (err || resp.statusCode !== 200) return done()
          send('user:update', {dats: json}, done)
        })
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
          key: null,
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
    },
    resetPassword: function (state, data, send, done) {
      var email = data || state.account.auth.basic.email
      api.users.resetPassword({email}, function (err, res, body) {
        if (err) return send('error:new', err.message, done)
        send('user:passwordResetResponse', body.message, done)
      })
    },
    resetPasswordConfirmation: function (state, data, send, done) {
      api.users.resetPasswordConfirmation(data, function (err, res, body) {
        if (err) return send('error:new', err.message, done)
        send('user:passwordResetConfirmResponse', body.message, done)
      })
    }
  }
}
