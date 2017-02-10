const EventSource = require('eventsource')
const xtend = require('xtend')

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
  }
}
