const html = require('choo/html')
const button = require('../../elements/button')

const preview = (state, prev, send) => {
  const isOpen = state.preview.isPanelOpen ? 'open' : ''
  const fileName = state.preview.fileName
  return html`<section id="preview" class="panel ${isOpen}">
    <div class="panel-header">
      ${button({
        klass: 'btn--green panel-header__close-button',
        text: 'Close',
        click: () => {
          send('preview:closePanel')
        }
      })}
      <div class="panel-header__title-group">
        <div class="panel-title">
          ${fileName}
        </div>
        <div class="dat-details">
          <div class="dat-detail">XX.X KB</div>
          <div class="dat-detail">some other metadata</div>
        </div>
      </div>
      <div class="panel-header__action-group">
        <button class="dat-header-action">Download</button>
        <button class="dat-header-action">Open in Desktop App</button>
      </div>
    </div>
    <div class="panel-main">
      [XXX preview content goes here]
    </div>
  </preview>`
}

module.exports = preview
