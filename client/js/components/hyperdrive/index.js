const hyperdriveRenderer = require('./client.js')
const noop = function () {}

module.exports = function (state, prev, send) {
  if (!module.parent && !state.archive.instance && state.archive.key) {
    send('archive:create', state.archive.key)
  }
  var onclick = (ev, entry, opts) => {
    if (ev.target.classList.contains('pagination')) {
      send('archive:update', opts)
      return // TODO: what does return do here
    } else if (entry.type === 'directory') {
      send('archive:update', {root: entry.name, offset: 0})
      return true
    } else {
      send('preview:file', {archiveKey: state.archive.key, entry: entry}, noop)
      return false
    }
  }
  var opts = {
    offset: state.archive.offset,
    limit: state.archive.limit
  }
  return hyperdriveRenderer(state.archive.root, state.archive.entries, opts, onclick)
}
