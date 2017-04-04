const path = require('path')
const yofs = require('yo-fs')
const noop = function () {}

module.exports = function (state, prev, send) {
  var entries = state.archive.entries
  var filename = state.location.params.wildcard

  var onclick = (ev, entry) => {
    if (entry.type === 'directory') {
      send('archive:update', {root: entry.name})
      return true
    } else {
      send('preview:file', {archiveKey: state.archive.key, entry: entry}, noop)
      return false
    }
  }

  var lookup = {}
  for (var i in entries) {
    var entry = entries[i]
    if (entry.name === filename && !module.parent) {
      console.log('displaying', filename)
      send('preview:file', {archiveKey: state.archive.key, entry: entry}, noop)
    }
    lookup[entry.name] = entry
    var dir = path.dirname(entry.name)
    if (!lookup[dir]) {
      lookup[dir] = {
        type: 'directory',
        name: dir,
        length: 0
      }
    }
  }
  var vals = Object.keys(lookup).map(key => lookup[key])
  var tree = yofs(state.archive.root, vals, onclick)
  return tree.widget
}
