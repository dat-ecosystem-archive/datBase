var hyperdriveRenderer
var noop = function () {}

if (module.parent) {
  hyperdriveRenderer = require('./../../app.js').getServerComponent('hyperdrive')
} else {
  hyperdriveRenderer = require('hyperdrive-ui')
}

module.exports = function (state, prev, send) {
  if (!module.parent && !state.archive.instance && state.archive.key) {
    send('archive:load', state.archive.key)
  }
  return hyperdriveRenderer(state.archive.instance, {root: state.archive.root, entries: state.archive.entries}, (ev, entry) => {
    if (entry.type === 'directory') {
      send('archive:update', {root: entry.name})
      return true
    } else {
      send('preview:file', {archiveKey: state.archive.key, entryName: entry.name}, noop)
      return false
    }
  })
}
