var xtend = require('xtend')
var noop = function () {}
var defaultState = {
  isPanelOpen: false,
  isLoading: false,
  entryName: null,
  error: false
}

module.exports = {
  namespace: 'preview',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.preview,
  reducers: {
    update: (data, state) => {
      return xtend(state, data)
    },
    openPanel: (data, state) => {
      return {isPanelOpen: true}
    },
    closePanel: (data, state) => {
      return defaultState
    }
  },
  effects: {
    file: (data, state, send, done) => {
      data.error = false
      send('preview:update', data, noop)
      send('preview:openPanel', {}, done)
      // TODO: state.preview.isPanelOpen + corresponding loading indicator in ui
    }
  }
}
