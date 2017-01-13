const fourohfour = require('../elements/404')

module.exports = function (state, prev, send) {
  const entryName = state.preview.entry && state.preview.entry.name

  if (state.preview.error) {
    return fourohfour({
      header: state.preview.error.message,
      body: state.preview.error.body || `${entryName} cannot be rendered.`,
      link: false
    })
  }
  if (!module.parent) return send('preview:update', {error: {message: 'Can not download at this time.', body: 'To view and download files, use the desktop app or command line tool.'}})
}
