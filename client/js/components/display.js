const fourohfour = require('../elements/404')
const html = require('choo/html')

module.exports = function (state, emit) {
  var display = html`<div id="item">

  ${fourohfour({
    icon: 'loader',
    header: 'Loading...',
    body: 'This could take a second..',
    link: false
  })}
  </div>`
  if (module.parent) return display
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
  return html`<iframe src="/download/${state.archive.key}/${entryName.replace(/#/g, '%23')}">
    </frame>
  `
}
