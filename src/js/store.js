var minidux = require('minidux')

function fileQueueReducer (state, action) {
  if (state === undefined) state = { queue: [] }
  if (action.type === 'ADD_FILES') {
    // TODO: don't forget to handle directories properly!
    if (action.files && action.files.length > 0) {
      action.files.forEach(function (file) {
        state.queue.push(file)
      })
      console.log('[store] added files')
    }
  }
}

function archiveReducer (state, action) {
  if (state === undefined) state = { archive: undefined }
  if (action.type === 'INIT_ARCHIVE' || action.type === 'UPDATE_ARCHIVE') {
    return { archive: action.archive }
  }
}

function peersReducer (state, action) {
  if (state === undefined) state = { peers: 0 }
  if (action.type === 'UPDATE_PEERS') {
    return { peers: action.peers }
  }
}

var reducers = minidux.combineReducers({
  fileQueueReducer: fileQueueReducer,
  archiveReducer: archiveReducer,
  peersReducer: peersReducer
})
var store = minidux.createStore(reducers)

module.exports = store
