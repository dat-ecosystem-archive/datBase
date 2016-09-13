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
      header: 'Unsupported filetype',
      body: `${state.preview.entryName} cannot be rendered.`,
      link: false
    })
  }
  if (entryName && archive) {
    data.render({
      name: entryName,
      createReadStream: function () {
        return archive.createFileReadStream(entryName)
      }
    }, display, function (error) {
      if (error) send('preview:update', {error})
    })
  }

  return display
}
