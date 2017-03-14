const fourohfour = require('../elements/404')
const http = require('nets')
const from = require('from2')
const html = require('choo/html')

const renderData = module.parent ? function () { } : require('render-data')
const display = html`<div id="item"></div>`

module.exports = function (state, prev, send) {
  const entryName = state.preview.entry && state.preview.entry.name
  const previousEntryName = prev && prev.preview ? prev.preview.entry && prev.preview.entry.name : null

  if (state.preview.error) {
    return fourohfour({
      header: state.preview.error.message,
      body: state.preview.error.body || `${entryName} cannot be rendered.`,
      link: false
    })
  }

  if (!entryName) return
  if (entryName === previousEntryName) return display
  if (state.preview.entry.length > (1048576 * 10)) {
    return send('preview:update', {error: {message: 'Cannot preview', body: 'This file is too big, use the desktop app or cli.'}})
  }

  send('preview:update', {error: {message: 'Loading', body: 'Please wait...'}})
  http({url: `/dat/${state.archive.key}/${entryName}`, method: 'GET'}, function (err, resp, file) {
    if (err) return send('preview:update', {error: err})
    renderData.render({
      name: entryName,
      createReadStream: function () {
        return from([file])
      }
    }, display, function (err) {
      if (err) {
        var update = {}
        var message = 'Unsupported filetype'
        update.isLoading = false // Allow downloads for unsupported files
        update.error = {message: message}
        return send('preview:update', update)
      }
      send('preview:update', {isLoading: false, error: err})
    })
  })
}
