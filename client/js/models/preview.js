var xtend = require('xtend')

var defaultState = {
  isPanelOpen: false,
  isLoading: false,
  entry: null,
  error: false
}

module.exports = {
  namespace: 'preview',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.preview,
  reducers: {
    update: (state, data) => {
      return xtend(state, data)
    },
    openPanel: (state, data) => {
      return {isPanelOpen: true}
    }
  },
  effects: {
    file: (state, data, send, done) => {
      data.error = false
      send('preview:update', data, function () {
        send('location:set', `/${data.entry.archiveKey}/${data.entry.name}`, function () {
          send('preview:openPanel', {}, done)
        })
      })
      // TODO: state.preview.isPanelOpen + corresponding loading indicator in ui
    },
    closePanel: (state, data, send, done) => {
      console.log(state)
      send('location:set', `/${state.entry.archiveKey}`, function () {
        send('preview:update', defaultState, done)
      })
    }
  }
}
