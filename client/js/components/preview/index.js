const html = require('choo/html')
const prettyBytes = require('pretty-bytes')
const button = require('../../elements/button')
const display = require('../display')

const preview = (state, prev, send) => {
  const isOpen = state.preview.isPanelOpen ? 'open' : ''
  const entryName = state.preview.entryName
  const metadata = state.archive.entries[entryName]
  const size = (metadata && metadata.length) ? prettyBytes(metadata.length) : 'N/A'

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
          ${entryName}
        </div>
        <div class="dat-details">
          <div class="dat-detail">${size}</div>
        </div>
      </div>
      <div class="panel-header__action-group">
        <button class="dat-header-action">Download</button>
        <a href="dat://${state.archive.key}" class="dat-header-action">Open in Desktop App</a>
      </div>
    </div>
    <div class="panel-main">
      <div id="display">
        ${display(state, prev, send)}
      </div>
    </div>
  </section>
  `
}

module.exports = preview
