var minidux = require('minidux')

function fileQueueReducer (state, action) {
  if (state === undefined) state = { queue: { writing: null, next: [] } }
  if (action.type === 'QUEUE_NEW_FILE_WRITE') {
    state.queue.next.push(action.file)
    console.log('[store] QUEUE_NEW_FILE done')
    debugger
  }


  if (action.type ==='QUEUE_WRITE_BEGIN') {
    state.queue.writing = state.queue.next[0]
    state.queue.next = state.queue.next.slice(1)
    debugger
  }

  if (action.type === 'QUEUE_WRITE_COMPLETE') {
    var shiftedItem = state.queue.next.shift()
    state.queue.writing = shiftedItem
    state.queue.next = state.queue.next.filter(function (file) {
      return file.fullPath !== shiftedItem.fullPath
    })
    console.log('[store] QUEUE_WRITE_COMPLETE done')
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
