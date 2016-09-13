var noop = function () {}
var defaultState = {
  isPanelOpen: false,
  isLoading: false,
  archiveKey: null,
  entryName: null,
  readStream: null,
  error: null
}

module.exports = {
  namespace: 'preview',
  state: defaultState,
  reducers: {
    update: (data, state) => {
      return data
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
      send('preview:update', data, noop)
      send('preview:openPanel', {}, done)
      // TODO: state.preview.isPanelOpen + corresponding loading indicator in ui
    }
  }
}
