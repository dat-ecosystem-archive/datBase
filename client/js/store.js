// TODO: this minidux store will also be obsolete once we're
// done migrating to choo, this is only still here for reference,
// delete it once we're done
var minidux = require('minidux')

function fileQueueReducer (state, action) {
  if (state === undefined) state = { queue: [{ writing: null, next: [] }] }

  // shallow copy the last `state` frame so we can preserve
  // file.progressListener refs:
  var stateCopy = {}
  stateCopy.writing = state.queue[state.queue.length - 1].writing
  stateCopy.next = state.queue[state.queue.length - 1].next

  if (action.type === 'QUEUE_NEW_FILE') {
    stateCopy.next.push(action.file)
    state.queue.push(stateCopy)
  }

  if (action.type === 'QUEUE_WRITE_BEGIN') {
    stateCopy.writing = stateCopy.next[0]
    stateCopy.next = stateCopy.next.slice(1)
    state.queue.push(stateCopy)
  }

  if (action.type === 'QUEUE_WRITE_COMPLETE') {
    stateCopy.writing = null
    state.queue.push(stateCopy)
  }

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
