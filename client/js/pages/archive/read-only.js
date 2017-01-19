const html = require('choo/html')
const hyperdrive = require('../../components/hyperdrive')
const copyButton = require('../../components/copy-button')
const header = require('../../components/header')
const preview = require('../../components/preview')
const permissions = require('../../elements/permissions')
const fourohfour = require('../../elements/404')
const error = require('../../elements/error')
const hyperdriveStats = require('../../elements/hyperdrive-stats')
const prettyBytes = require('pretty-bytes')

var ARCHIVE_ERRORS = {
  'Invalid Key': 'No dat here.',
  'timed out': 'No sources found.'
}

const archivePage = (state, prev, send) => {
  if (state.archive.error) {
    var cleaned = ARCHIVE_ERRORS[state.archive.error.message]
    if (cleaned) {
      var props = {
        header: cleaned
      }
      return html`
      <div>
      ${header(state, prev, send)}
      ${fourohfour(props)}
      </div>
      `
    }
  }
  var health = state.archive.health
  var sources = health ? health.connected : 0
  var size = prettyBytes(state.archive.health.bytes)

  return html`
    <div>
      ${header(state, prev, send)}
      <div id="dat-info" class="dat-header">
        <div class="container">
          <div class="dat-header__actions">
            <div class="dat-header-action">
              ${copyButton(state.archive.key, send)}
           </div>
            <a href="https://github.com/datproject/dat-desktop" target="_blank" class="dat-header-action">
              <div class="btn__icon-wrapper">
                <svg><use xlink:href="#daticon-open-in-desktop" /></svg>
                <span class="btn__icon-text">Open in Desktop App</span>
              </div>
            </a>
          </div>
          <div id="title" class="share-link">${state.archive.metadata.title || state.archive.key}</div>
          <div id="author" class="author-name">${state.archive.metadata.author}</div>
          ${error(state.archive.error)}
          <div class="dat-details">
            <div id="permissions" class="dat-detail">
              ${permissions({owner: state.archive.owner})}
            </div>
            <div id="hyperdrive-size" class="dat-detail"><p class="size">${size}</p></div>
            <div id="peers" class="dat-detail">${sources} Source(s)</div>
          </div>
            <div class="dat-detail">
            ${state.archive.owner ? 'Data is deleted once the browser tab is closed.' : ''}
            </div>
        </div>
      </div>
      <main class="site-main">
        <div class="container">
          ${hyperdrive(state, prev, send)}
        </div>
      </main>
      <div class="status-bar">
        <div class="container">
          <span id="help-text" class="status-bar-status"></span>
          ${(state.archive.downloadTotal || state.archive.uploadTotal)
            ? html`<div id="hyperdrive-stats" class="status-bar-stats">
                Total: ${hyperdriveStats({ downloaded: state.archive.downloadTotal, uploaded: state.archive.uploadTotal })}
              </div>`
            : ''}
        </div>
      </div>
      ${preview(state, prev, send)}
    </div>`
}

module.exports = archivePage
