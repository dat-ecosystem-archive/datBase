var hyperdriveRenderer
var noop = function () {}

if (module.parent) {
  hyperdriveRenderer = require('./../../app.js').getServerComponent('hyperdrive')
} else {
  hyperdriveRenderer = require('./client.js')
}

module.exports = function (state, prev, send) {
  if (!module.parent && !state.archive.instance && state.archive.key) {
    send('archive:load', state.archive.key)
  }
  var onclick = (ev, entry) => {
    if (entry.type === 'directory') {
      send('archive:update', {root: entry.name})
      return true
    } else {
      send('preview:file', {archiveKey: state.archive.key, entryName: entry.name}, noop)
      return false
    }
  }
  return hyperdriveRenderer(state.archive.root, state.archive.entries, onclick)
}
