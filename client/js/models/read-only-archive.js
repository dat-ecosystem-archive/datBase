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
    getMetadata: function (state, data, send, done) {
      http(`/dat/${state.key}/dat.json`, function (err, resp, raw) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        var json
        try {
          json = JSON.parse(raw)
        } catch (e) {
          return send('archive:update', {error: {message: 'Malformed dat.json file'}}, done)
        }
        send('archive:update', {metadata: json}, done)
      })
    },
    delete: function (state, data, send, done) {
      api.dats.delete({id: data.id}, function (err, resp, json) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        window.location.href = '/list'
      })
    }
  },
  subscriptions: [
    function (send, done) {
      // TODO: make sure we aren't clogging the archiver with unused disk space
      // send('archive:getMetadata', {}, done)
    }
  ]
}
