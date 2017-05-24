const xtend = require('xtend')
const api = require('../api')()
const http = require('nets')

var defaultState = {
  id: null,
  key: null,
  peers: 0,
  error: null,
  root: '',
  metadata: {},
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
      if (!state.key || state.fetched) return done()
      send('archive:update', {fetched: true}, function () {
        http({url: `/metadata/${state.key}?timeout=${data.timeout}`, method: 'GET', json: true}, function (err, resp, json) {
          if (err) return send('archive:update', {error: {message: err.message}}, done)
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
