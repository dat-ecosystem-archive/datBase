const html = require('choo/html')
const prettyBytes = require('pretty-bytes')
const button = require('../../elements/button')
const display = require('../display')

const preview = (state, prev, send) => {
  if (typeof document !== 'undefined') {
    if (state.preview.isPanelOpen) document.body.classList.add('panel-open')
    else document.body.classList.remove('panel-open')
  }
  const isOpen = state.preview.isPanelOpen ? 'open' : ''
  const entry = state.preview.entry
  const entryName = entry && entry.name
  const size = (entry && entry.length) ? prettyBytes(entry.length) : 'N/A'

  return html`<section id="preview" class="panel ${isOpen}">
    <div class="panel-header">
      <button onclick=${() => send('preview:closePanel')} class="panel-header__close-button">
      Close
      </button>
      <div class="panel-header__title-group">
        <div class="panel-title truncate">
          ${entryName}
        </div>
        <div class="dat-details">
          <div class="dat-detail size">${size}</div>
        </div>
      </div>
      <div class="panel-header__action-group">
        ${button({
          klass: 'dat-header-action',
          icon: '/public/img/download.svg',
          text: 'Download',
          disabled: state.preview.isLoading,
          click: () => {
            send('archive:downloadAsZip', {entryName})
          }
        })}
        <a href="dat://${state.archive.key}" class="dat-header-action">
          <div class="btn__icon-wrapper">
            <img src="/public/img/open-in-desktop.svg" class="btn__icon-img">
            <span class="btn__icon-text">Open in Desktop App</span>
          </div>
        </a>
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
