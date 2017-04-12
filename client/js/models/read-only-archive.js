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
    directory: function (state, data, send, done) {
      send('location:set', `/${state.key}/${data}`, function () {
        send('archive:update', {root: data}, done)
      })
    },
    getMetadata: function (state, data, send, done) {
      if (!state.key) return done()
      http({url: `/metadata/${state.key}?timeout=${data.timeout}`, method: 'GET', json: true}, function (err, resp, json) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        if (json.error) return send('archive:update', json, done)
        if (json.entries) json.error = null
        send('archive:update', json, done)
      })
    },
    delete: function (state, data, send, done) {
      api.dats.delete({id: data.id}, function (err, resp, json) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        window.location.href = '/explore'
      })
    }
  }
}
