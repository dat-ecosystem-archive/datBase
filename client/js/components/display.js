const fourohfour = require('../elements/404')
const http = require('stream-http')
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

  send('preview:update', {error: {message: 'Loading', body: 'Please wait...'}})
  http.get(`/dat/${state.archive.key}/${entryName}`, function (res) {
    res.on('error', function (err) { throw err })
    renderData.render({
      name: entryName,
      createReadStream: function () {
        return res
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
