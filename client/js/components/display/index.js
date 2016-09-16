const html = require('choo/html')
const loading = require('../../elements/loading')
const fourohfour = require('../../elements/404')

// XXX: server-side data rendering could pull from a cache if we want
const renderData = module.parent ? function () { } : require('render-data')
const display = html`<div id="item">${loading()}</div>`

module.exports = function (state, prev, send) {
  const archive = state.archive.instance
  const entryName = state.preview.entryName
  const previousEntryName = prev && prev.preview ? prev.preview.entryName : null

  if (state.preview.error && !prev.preview.error) {
    return fourohfour({
      header: state.preview.error.message,
      body: `${state.preview.entryName} cannot be rendered.`,
      link: false
    })
  }

  // only render/re-render when the entry name changes!
  if (!entryName || (entryName === previousEntryName)) {
    return
  }

  if (entryName && archive) {
    archive.get(entryName, {timeout: 3000}, function (err, entry) {
      if (err) {
        if (err.code && err.code === 'ETIMEDOUT') {
          return send('preview:update', {error: new Error('Could not find any peer sources.')})
        } else {
          return send('preview:update', {error: new Error(err)})
        }
      }
      // XXX TODO: we might have to check # of blocks downloaded for large files
      if (archive.isEntryDownloaded(entry)) {
        var stream = archive.createFileReadStream(entryName)
        renderData.render({
          name: entryName,
          createReadStream: function () { return stream }
        }, display, function (error) {
          if (error) {
            var message = 'Unsupported filetype'
            if (error.message === 'premature close') message = 'Could not find any peer sources.'
            send('preview:update', {error: new Error(message)})
          }
        })
      } else {
        send('preview:update', {error: new Error('Could not find any peer sources.')})
      }
    })
  }

  return display
}
