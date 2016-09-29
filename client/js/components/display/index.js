const html = require('choo/html')
const loading = require('../../elements/loading')
const fourohfour = require('../../elements/404')

// XXX: server-side data rendering could pull from a cache if we want
const renderData = module.parent ? function () { } : require('render-data')
const display = html`<div id="item">${loading()}</div>`

module.exports = function (state, prev, send) {
  const archive = state.archive.instance
  const entryName = state.preview.entry && state.preview.entry.name
  const previousEntryName = prev && prev.preview ? prev.preview.entry && prev.preview.entry.name : null

  if (state.preview.error && !prev.preview.error) {
    return fourohfour({
      header: state.preview.error.message,
      body: state.preview.error.body || `${entryName} cannot be rendered.`,
      link: false
    })
  }

  // only render/re-render when the entry name changes!
  if (!entryName) {
    return
  } else if (entryName === previousEntryName) {
    return display
  }

  if (entryName && archive) {
    archive.get(entryName, {timeout: 3000}, function (err, entry) {
      if (err) {
        if (err.code && err.code === 'ETIMEDOUT') {
          return send('preview:update', {error: {message: 'Looking for peers...', body: 'It seems to be taking a long time.'}})
        } else {
          return send('preview:update', {error: err})
        }
      }
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
    })
  }

  return display
}
