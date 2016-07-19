var minidux = require('minidux')

function fileQueueReducer (state, action) {
  if (state === undefined) state = { queue: { writing: null, next: [] } }


    // TODO: tomro: make this a proper reducer
    // push each new state of the queue model into the
    // state so you can see "backwards" in time


  if (action.type === 'QUEUE_NEW_FILE') {
    // debugger
    state.queue.next.push(action.file)
    console.log('QUEUE_NEW_FILE_WRITE ' + action.file.fullPath)
  }

  if (action.type ==='QUEUE_WRITE_BEGIN') {
    // debugger
    state.queue.writing = state.queue.next[0]
    state.queue.next = state.queue.next.slice(1)

    var foo = state.queue.writing ? state.queue.writing.fullPath : ''
    console.log('QUEUE_WRITE_BEGIN ' + foo)
  }

  if (action.type === 'QUEUE_WRITE_COMPLETE') {
    console.log('QUEUE_WRITE_COMPLETE ' + state.queue.writing.fullPath)
    state.queue.complete = state.queue.completed.push(state.queue.writing)
    state.queue.writing = null
  }

  // console.log('[store] fileQueueReducer state: ', state)
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
