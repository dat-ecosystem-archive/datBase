const html = require('choo/html')

// XXX: server-side data rendering could pull from a cache if we want
const data = module.parent ? function () { } : require('render-data')
const display = html`<div id="item"></div>`

module.exports = function (state, prev, send) {
  const entryName = state.preview.entryName
  const archive = state.archive.instance
  if (entryName && archive) {
    data.render({
      name: entryName,
      createReadStream: function () {
        return archive.createFileReadStream(entryName)
      }
    }, display, function (err) {
      if (err) throw err
    })
  }

  return display
}
