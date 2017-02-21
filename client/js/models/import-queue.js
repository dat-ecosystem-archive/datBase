const HyperdriveImportQueue = require('hyperdrive-import-queue')

const noop = function () {}

var hyperdriveImportQueue

var defaultState = {
  writing: null,
  writingProgressPct: null,
  next: []
}

module.exports = {
  namespace: 'importQueue',
  state: module.parent ? defaultState : window.dl.init__dehydratedAppState.importQueue,
  reducers: {
    update: (state, data) => {
      // shallow copy the last `state` frame so we can preserve
      // file.progressListener refs:
      var stateCopy = {}
      stateCopy.writing = state.writing
      stateCopy.writingProgressPct = state.writingProgressPct
      stateCopy.next = state.next
      // new file is enqueued:
      if (data.onQueueNewFile) stateCopy.next.push(data.file)
      // next file begins writing:
      if (data.onFileWriteBegin) {
        stateCopy.writing = stateCopy.next[0]
        stateCopy.next = stateCopy.next.slice(1)
      }
      // write progress on current file writing:
      if (data.writing && data.writing.fullPath && data.writingProgressPct) {
        if (stateCopy.writing && (stateCopy.writing.fullPath === data.writing.fullPath)) {
          stateCopy.writingProgressPct = data.writingProgressPct
        }
      }
      // current file is done writing:
      if (data.onFileWriteComplete) {
        stateCopy.writing = null
        stateCopy.writingProgressPct = null
      }
      return stateCopy
    },
    reset: (state, data) => {
      var writing = state.writing
      if (writing && writing.progressListener && writing.progressHandler) {
        writing.progressListener.removeListener('progress', writing.progressHandler)
      }
      return {
        writing: null,
        writingProgressPct: null,
        next: []
      }
    }
  },
  effects: {
    add: function (state, data, send, done) {
      hyperdriveImportQueue.add(data.files, data.root)
      return done()
    },
    init: function (state, data, send, done) {
      send('importQueue:reset', {}, noop)
      hyperdriveImportQueue = HyperdriveImportQueue(null, data.archive, {
        progressInterval: 500,
        onQueueNewFile: function (err, file) {
          if (err) console.log(err)
          send('importQueue:update', {onQueueNewFile: true, file: file}, noop)
        },
        onFileWriteBegin: function (err, file) {
          if (err) console.log(err)
          if (file && !file.progressHandler) {
            file.progressHandler = (progress) => {
              const pct = parseInt(progress.percentage)
              send('importQueue:update', {writing: file, writingProgressPct: pct}, function () {})
            }
            file.progressListener.on('progress', file.progressHandler)
          }
          send('importQueue:update', {onFileWriteBegin: true}, noop)
        },
        onFileWriteComplete: function (err, file) {
          if (err) console.log(err)
          if (file && file.progressListener && file.progressHandler) {
            file.progressListener.removeListener('progress', file.progressHandler)
          }
          send('importQueue:update', {onFileWriteComplete: true}, noop)
        }
      })
    }
  }
}
