const hyperdriveRenderer = require('./client.js')
const noop = function () {}

module.exports = function (state, emit) {
  var onclick = (ev, entry) => {
    if (entry.type === 'directory') {
      emit('archive:directory', entry.name)
      return true
    } else {
      entry.archiveKey = state.archive.key
      emit('preview:file', {entry: entry}, noop)
      return false
    }
  }

  return hyperdriveRenderer(state.archive.root, state.archive.entries, onclick)
}
