const township = require('township-client')
const qs = require('querystring')
const http = require('choo/http')

const defaultState = {
  username: null,
  email: null,
  token: null,
  login: 'hidden',
  sidePanel: 'hidden',
  dats: []
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
      const params = qs.stringify({username: data.username})
      http.get(window.location.origin + '/api/v1/dats?' + params, {
        headers: { authorization: 'Bearer ' + data.token },
        json: true
      }, function (err, resp, json) {
        if (resp.statusCode === 400 && resp.body.indexOf('jwt expired')) {
          // TODO: sometimes jwt expires but app still thinks logged in...
        }
        if (err || resp.statusCode !== 200) return done()
        send('user:update', {dats: json}, done)
      })
    },
    whoami: (data, state, send, done) => {
      const client = getClient()
      const user = client.getLogin()
      if (user) {
        send('user:update', user, done)
        send('user:dats', user, done)
      } else done()
    },
    logout: (data, state, send, done) => {
      const client = getClient()
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
    },
  }
}
