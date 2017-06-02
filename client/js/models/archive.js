const xtend = require('xtend')
const api = require('../api')()
const http = require('nets')

var defaultState = {
  id: null,
  key: null,
  retries: 0,
  peers: 0,
  error: null,
  root: '',
  metadata: {},
  fetching: false,
  entries: []
}

module.exports = {
  namespace: 'archive',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.archive,
  reducers: {
    update: (state, data) => {
      return xtend(state, data)
    }
  },
  effects: {
    directory: function (state, root, send, done) {
      var path = root === '.' ? '' : `/contents/${root}`
      send('location:set', `/${state.key}${path}`, function () {
        send('archive:update', {root: root}, done)
      })
    },
    getMetadata: function (state, data, send, done) {
      if (!state.key || state.fetching) return done()
      send('archive:update', {fetching: true, retries: state.retries + 1}, function () {
        http({url: `/metadata/${state.key}?timeout=${data.timeout}`, method: 'GET', json: true}, function (err, resp, json) {
          json.fetching = false
          if (err) return send('archive:update', xtend({error: {message: err.message}}, json), done)
          if (json.error) return send('archive:update', json, done)
          if (json.entries) json.error = null
          send('archive:update', json, done)
        })
      })
    },
    delete: function (state, data, send, done) {
      api.dats.delete({id: data.id}, function (err, resp, json) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        window.location.href = '/profile'
      })
    }
  }
}
