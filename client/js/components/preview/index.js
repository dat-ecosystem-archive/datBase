const html = require('choo/html')
const button = require('../../elements/button')

const preview = (state, prev, send) => {
  const isOpen = state.preview.isPanelOpen ? 'open' : ''
  const fileName = state.preview.fileName
  return html`<section id="preview" class="panel ${isOpen}">
    <div class="panel-contents">
      ${fileName}
      ${button({
        klass: 'close-panel',
        text: 'close',
        click: () => {
          send('preview:closePanel')
        }
      })}
    </div>
  </preview>`
}

module.exports = preview
