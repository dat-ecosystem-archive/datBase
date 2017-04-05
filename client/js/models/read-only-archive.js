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
  subscriptions: {
    metadata: function (send, done) {
      send('archive:getMetadata', {}, done)
    }
  },
  effects: {
    getMetadata: function (state, data, send, done) {
      if (!state.key) return done()
      http({url: `/metadata/${state.key}`, method: 'GET', json: true}, function (err, resp, json) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        send('archive:update', json, done)
      })
    },
    delete: function (state, data, send, done) {
      api.dats.delete({id: data.id}, function (err, resp, json) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        window.location.href = '/list'
      })
    }
  }
}
