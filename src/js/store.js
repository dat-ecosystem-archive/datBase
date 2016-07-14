var minidux = require('minidux')

function fileQueueReducer (state, action) {
  if (state === undefined) state = { queue: [] }
  if (action.type === 'ADD_FILE') {
    // TODO: don't forget to handle directories properly!
    if (action.file) {
      state.queue.push(action.file)
      console.log('[store] added file to queue')
      return { queue: state.queue }
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
