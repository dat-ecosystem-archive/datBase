const xtend = require('xtend')
const xhr = require('xhr')

var defaultState = {
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
    update: (data, state) => {
      return xtend(state, data)
    }
  },
  effects: {
    getMetadata: function (data, state, send, done) {
      xhr(`/dat/${state.key}/dat.json`, function (err, resp, raw) {
        if (err) return send('archive:update', {error: {message: err.message}}, done)
        var json
        try {
          json = JSON.parse(raw)
        } catch (e) {
          return send('archive:update', {error: {message: 'Malformed dat.json file'}}, done)
        }
        send('archive:update', {metadata: json}, done)
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
