const hyperdriveRenderer = require('./client.js')

module.exports = function (state, prev, send) {
  var onclick = (ev, entry) => {
    if (entry.type === 'directory') {
      send('archive:update', {root: entry.name})
      return true
    } else {
      return false
    }
  }

  return hyperdriveRenderer(state.archive.root, state.archive.entries, onclick)
}
