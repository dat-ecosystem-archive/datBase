const html = require('choo/html')
const loading = require('../elements/loading')
const fourohfour = require('../elements/404')

// XXX: server-side data rendering could pull from a cache if we want
const display = html`<div id="item">${loading()}</div>`

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
  return send('preview:update', {error: {message: 'Can not download at this time.', body: 'To view and download files, use the desktop app or command line tool.'}})

  // // only render/re-render when the entry name changes!
  // if (!entryName) {
  //   return
  // } else if (entryName === previousEntryName) {
  //   return display
  // }

  // TODO: make all the below code fetch a data preview via websockets instead
  //
  // if (entryName && archive) {
  //   send('preview:update', {error: {message: 'Looking for peers...', body: 'If it is taking a long time, use the desktop app.'}})
  //   var stream = archive.createFileReadStream(entryName)
  //   renderData.render({
  //     name: entryName,
  //     createReadStream: function () { return stream }
  //   }, display, function (error) {
  //     if (error) {
  //       var update = {}
  //       var message = 'Unsupported filetype'
  //       if (error.message === 'premature close') message = 'Could not find any peer sources.'
  //       else update.isLoading = false // Allow downloads for unsupported files
  //       update.error = {message: message}
  //       return send('preview:update', update)
  //     }
  //     send('preview:update', {isLoading: false, error: error})
  //   })
  // }

  // return display
}
