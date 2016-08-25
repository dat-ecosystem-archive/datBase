var noop = function () {}
var defaultState = {
  isPanelOpen: false,
  isLoading: false,
  archiveKey: null,
  fileName: null,
  fileContents: null,
  error: null
}

module.exports = {
  namespace: 'preview',
  state: defaultState,
  reducers: {
    updateFile: (data, state) => {
      return {
        archiveKey: data.archiveKey || state.archiveKey,
        fileName: data.entry || state.entry
      }
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
      send('preview:updateFile', data, noop)
      send('preview:openPanel', {}, noop)
      send('archive:readFile', data, noop)
      // TODO: state.preview.isPanelOpen + corresponding loading indicator in ui
    }
  }
}
