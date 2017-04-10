const hyperdriveRenderer = require('./client.js')
const noop = function () {}

module.exports = function (state, prev, send) {
  var onclick = (ev, entry) => {
    if (entry.type === 'directory') {
      send('archive:update', {root: entry.name})
      return true
    } else {
      entry.archiveKey = state.archive.key
      send('preview:file', {entry: entry}, noop)
      return false
    }
  }

  return hyperdriveRenderer(state.archive.root, state.archive.entries, onclick)
}
