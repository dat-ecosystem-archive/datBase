var render = require('render-data')

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
    update: (data, state) => {
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
      send('preview:update', data, noop)
      send('preview:openPanel', {}, noop)
      send('archive:readFile', data, function (readStream) {
        var displayElem = document.querySelector('#render')
        render.render({
           name: data.entry,
           createReadStream: function () {
             return readStream
           }
         }, displayElem, function (err) {
           if (err) throw err
         })
      })
      // TODO: state.preview.isPanelOpen + corresponding loading indicator in ui
    }
  }
}
