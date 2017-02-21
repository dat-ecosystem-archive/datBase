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
  cers: {
    update: (state, data) => {
      return xtend(state, data)
    },
    openPanel: (state, data) => {
      return {isPanelOpen: true}
    },
    closePanel: (state, data) => {
      return defaultState
    }
  },
  effects: {
    file: (state, data, send, done) => {
      data.error = false
      send('preview:update', data, noop)
      send('preview:openPanel', {}, done)
      // TODO: state.preview.isPanelOpen + corresponding loading indicator in ui
    }
  }
}
