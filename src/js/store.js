var minidux = require('minidux')

function fileQueueReducer (state, action) {
  if (state === undefined) state = { queue: { writing: null, next: [] } }
  if (action.type === 'QUEUE_NEW_FILE_WRITE') {
    debugger
    state.queue.next.push(action.file)
    console.log('QUEUE_NEW_FILE_WRITE ' + action.file.fullPath)
  }

  if (action.type ==='QUEUE_WRITE_BEGIN') {
    debugger
    state.queue.writing = state.queue.next[0]
    state.queue.next = state.queue.next.slice(1)

    var foo = state.queue.writing ? state.queue.writing.fullPath : ''
    console.log('QUEUE_WRITE_BEGIN ' + state.queue.writing.fullPath)
  }

  if (action.type === 'QUEUE_WRITE_COMPLETE') {
    debugger
    console.log('QUEUE_WRITE_COMPLETE ' + state.queue.writing.fullPath)
    state.queue.writing = state.queue.next[0]
    state.queue.next = state.queue.next.slice(1)
  }

  console.log('[store] fileQueueReducer state: ', state)
  return { queue: state.queue }
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
