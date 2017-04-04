const hyperdriveRenderer = require('./client.js')
const noop = function () {}

module.exports = function (state, prev, send) {
  var filename = state.location.params.filename

  var onclick = (ev, entry) => {
    if (entry.type === 'directory') {
      send('archive:update', {root: entry.name})
      return true
    } else {
      send('preview:file', {archiveKey: state.archive.key, entry: entry}, noop)
      return false
    }
  }

  if (filename) {
    send('preview:file', {archiveKey: state.archive.key, entry: {name: filename}})
  }

  return hyperdriveRenderer(state.archive.root, state.archive.entries, onclick)
}
