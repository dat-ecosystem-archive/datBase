const api = require('../api')()
const xtend = require('xtend')

const defaultState = {
  username: null,
  profile: {},
  key: null,
  email: null,
  token: null,
  register: 'hidden',
  sidePanel: 'hidden',
  passwordResetResponse: null,
  passwordResetConfirmResponse: null
}

module.exports = {
  namespace: 'township',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.township,
  reducers: {
    update: (state, data) => {
      return xtend(state, data)
    },
    sidePanel: (state, data) => {
      return { sidePanel: state.sidePanel === 'hidden' ? '' : 'hidden' }
    },
    passwordResetResponse: function (state, data) {
      return { passwordResetResponse: data }
    },
    passwordResetConfirmResponse: function (state, data) {
      return { passwordResetConfirmResponse: data, passwordResetResponse: null }
    },
    error: function (state, data) {
      return xtend(state, {error: data})
    }
  },
  subscriptions: {
    checktownship: function (send, done) {
      send('township:whoami', {}, done)
    }
  },
  effects: {
    whoami: (state, data, send, done) => {
      const user = api.whoami()
      if (user.username) {
        api.users.get(data, function (err, resp, results) {
          if (err && err.message === 'jwt expired') return send('township:logout', data, done)
          if (!results.length) return done()
          user.profile = results[0]
          api.dats.get({user_id: user.id}, function (err, resp, results) {
            if (err && err.message === 'jwt expired') return send('township:logout', data, done)
            user.dats = results
            send('township:update', user, done)
          })
        })
      } else done()
    },
    logout: (state, data, send, done) => {
      api.logout(data, function (err, resp, data) {
        if (err) return send('township:error', err.message, done)
        send('township:update', defaultState, function () {
          send('message:success', 'Logged out.', function () {
            window.location.href = '/explore'
          })
        })
      })
    },
    login: (state, data, send, done) => {
      api.login(data, function (err, resp, data) {
        if (err) return send('township:error', err.message, done)
        data.login = 'hidden'
        send('township:update', data, function () {
          send('message:success', 'Logged in successfully.', done)
          window.location.href = '/install'
        })
      })
    },
    register: (state, data, send, done) => {
      api.register(data, function (err, resp, data) {
        if (err) return send('township:error', err.message, done)
        data.register = 'hidden'
        send('township:update', data, function () {
          send('message:success', 'Registered successfully.', done)
          window.location.href = '/install'
        })
      })
    },
    resetPassword: function (state, data, send, done) {
      var email = data || state.account.auth.basic.email
      api.users.resetPassword({email}, function (err, res, body) {
        if (err) return send('township:error', err.message, done)
        send('township:passwordResetResponse', body.message, done)
      })
    },
    resetPasswordConfirmation: function (state, data, send, done) {
      api.users.resetPasswordConfirmation(data, function (err, res, body) {
        if (err) return send('township:error', err.message, done)
        send('township:passwordResetConfirmResponse', body.message, done)
      })
    }
  }
}
