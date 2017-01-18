const xtend = require('xtend')

var defaultState = {
  key: null,
  health: {
    connected: 0,
    blocks: 0,
    peers: [],
    bytes: 0
  },
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
  }
}
