const html = require('choo/html')
const fourohfour = require('../../elements/404')

// XXX: server-side data rendering could pull from a cache if we want
const data = module.parent ? function () { } : require('render-data')
const display = html`<div id="item"></div>`

module.exports = function (state, prev, send) {
  const entryName = state.preview.entryName
  const archive = state.archive.instance

  if (state.preview.error) {
    return fourohfour({
      header: state.preview.error.message,
      body: `${state.preview.entryName} cannot be rendered.`,
      link: false
    })
  }
  if (entryName && archive) {
    var done = false
    var stream = archive.createFileReadStream(entryName)
    setTimeout(function () {
      send('preview:update', {error: new Error('Could not find any sources.')})
      if (!done) stream.destroy()
    }, 1000)
    stream.on('data', function (data) {
      done = true
    })
    data.render({
      name: entryName,
      createReadStream: function () {
        return stream
      }
    }, display, function (error) {
      if (error) {
        var message = 'Unsupported filetype'
        if (error.message === 'premature close') message = 'Could not find any sources.'
        send('preview:update', {error: new Error(message)})
      }
    })
  }

  return display
}
