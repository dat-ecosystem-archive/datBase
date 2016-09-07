const html = require('choo/html')
const importQueue = require('../../components/import-queue')
const hyperdrive = require('../../components/hyperdrive')
const permissions = require('../../elements/permissions')
const fourohfour = require('../../elements/404')
const addFiles = require('../../elements/add-files')
const header = require('../../components/header')
const error = require('../../elements/error')
const hyperdriveStats = require('../../elements/hyperdrive-stats')
const prettyBytes = require('pretty-bytes')
const preview = require('../../components/preview')

const archivePage = (state, prev, send) => {
  // XXX: have an error enum?
  if (state.archive.error && state.archive.error.message === 'Invalid key') {
    var props = {
      header: 'No dat here.'
    }
    return html`
    <div>
    ${header(state, prev, send)}
    ${fourohfour(props)}
    </div>
    `
  }
  return html`
    <div>
      ${header(state, prev, send)}
      <div id="dat-info" class="dat-header">
        <div class="container">
          <div class="dat-header__actions">
            <button class="dat-header-action">Download</button>
            <button class="dat-header-action">Open in Desktop App</button>
          </div>
          <div id="share-link" class="share-link">${state.archive.key}</div>
          ${error(state.archive.error)}
          <div class="dat-details">
            <div id="permissions" class="dat-detail">${permissions({owner: state.archive.instance ? state.archive.instance.owner : false})}</div>
            <div id="hyperdrive-size" class="dat-detail"><p id="size">${prettyBytes(state.archive.size || 0)}</p></div>
            <div id="peers" class="dat-detail">${state.archive.numPeers} Source(s)</div>
            <div id="speed" class="dat-detail dat-detail--speed"><div>
              ${hyperdriveStats({ downloaded: state.archive.downloadSpeed, uploaded: state.archive.uploadSpeed })}
            </div></div>
          </div>
        </div>
      </div>
      <main class="site-main">
        <div class="container">
          <div id="add-files">${state.archive.instance && state.archive.instance.owner ? addFiles({ onfiles: (files) => send('archive:importFiles', {files}) }) : ''}</div>
          ${importQueue(state, prev, send)}
          ${hyperdrive(state, prev, send)}
        </div>
      </main>
      <div class="status-bar">
        <div class="container">
          <span id="help-text" class="status-bar-status"></span>
          <div id="hyperdrive-stats" class="status-bar-stats">
            Total: ${hyperdriveStats({ downloaded: state.archive.downloadTotal, uploaded: state.archive.uploadTotal })}
          </div>
        </div>
      </div>
      ${preview(state, prev, send)}
    </div>`
}

module.exports = archivePage
