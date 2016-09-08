const from = require('from2')
var noop = function () {}

if (module.parent) {
  var hyperdriveRenderer = require('./../../app.js').getServerComponent('hyperdrive')

  module.exports = function (state, prev, send) {
    return hyperdriveRenderer({entries: state.archive.entries})
  }
} else {
  module.exports = function (state, prev, send) {
    if (!state.archive.instance) {
      state.archive.instance = {
        list: () => from.obj(state.archive.entries)
      }
      // No instance but with key, this means we are just rehydrated
      if (state.archive.key) {
        send('archive:load', state.archive.key)
      }
    }

    // Use dumb mode for hyperdrive-ui
    return require('hyperdrive-ui')(null, {root: state.archive.cwd, entries: state.archive.entries}, (ev, entry) => {
      if (entry.type === 'directory') {
        send('archive:update', {root: entry.name})
        return true
      } else {
        send('preview:file', {archiveKey: state.archive.key, entryName: entry.name}, noop)
        return false
      }
    })
  }
}
