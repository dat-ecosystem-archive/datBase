const fourohfour = require('../elements/404')
const http = require('nets')
const from = require('from2')
const html = require('choo/html')

const renderData = module.parent ? function () { } : require('render-data')

module.exports = function (state, emit) {
  var display = html`<div id="item">

  ${fourohfour({
    icon: 'loader',
    header: 'Loading...',
    body: 'This could take a second..',
    link: false
  })}

  </div>`
  if (module.parent) return
  const entryName = state.preview.entry && state.preview.entry.name

  if (state.preview.error) {
    if (!state.preview.isPanelOpen) {
      emit('preview:openPanel', {})
    }
    return fourohfour({
      icon: state.preview.error.icon,
      header: state.preview.error.message,
      body: state.preview.error.body || `${entryName} cannot be rendered.`,
      link: false
    })
  }
  if (!entryName) return display
  if (!state.preview.isPanelOpen) return emit('preview:openPanel', {})
  if (state.preview.entry.size > (1048576 * 10)) {
    return fourohfour({
      header: 'Cannot preview',
      body: 'This file is too big, use the desktop app or CLI.',
      link: false
    })
  }

  // proper escape is done, but # is special
  http({url: `/download/${state.archive.key}/${entryName.replace(/#/g, '%23')}`, method: 'GET'}, function (err, resp, file) {
    if (resp.statusCode === 400) err = new Error('File does not exist.')
    if (err) return emit('preview:update', {error: err})
    try {
      renderData.render({
        name: entryName,
        createReadStream: function () {
          return from([file])
        }
      }, display, function (err) {
        if (err) return onerror(err)
      })
    } catch (err) {
      onerror(err)
    }

    function onerror (err) {
      console.log('got err', err)
      var update = {}
      console.error(err)
      var message = 'Unsupported filetype'
      update.isLoading = false // Allow downloads for unsupported files
      update.error = {message: message}
      console.log('sending', update)
      return emit('preview:update', update)
    }
  })
  return display
}
