const api = require('../api')()
const xtend = require('xtend')

const defaultState = {
  dats: [],
  id: null,
  email: null,
  name: null,
  username: null,
  description: null
}

module.exports = {
  namespace: 'profile',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.profile,
  reducers: {
    update: (state, data) => {
      return xtend(state, data)
    }
  },
  effects: {
    edit: (state, data, send, done) => {
      api.users.update(data, function (err, resp, json) {
        if (err) return send('township:error', err.message, done)
        send('township:update', {profile: data}, function () {
          send('message:success', 'Profile edited successfully!', done)
        })
      })
    },
    get: (state, data, send, done) => {
      api.users.get(data, function (err, resp, json) {
        if (err) return send('message:error', err.message, done)
        if (!json.length) return send('message:error', 'User not found.', done)
        var user = json[0]
        api.dats.get({user_id: user.id}, function (err, resp, results) {
          if (err) return send('message:error', err.message, done)
          user.dats = results
          send('profile:update', user, done)
        })
      })
    }
  }
}
