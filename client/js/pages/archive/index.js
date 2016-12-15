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
  var archive = state.archive.instance
  var size = prettyBytes(archive && archive.content ? archive.content.bytes : 0)

  return html`
    <div>
      ${header(state, prev, send)}
      <div id="dat-info" class="dat-header">
        <div class="container">
          <div class="dat-header__actions">
            <button class="dat-header-action" onclick=${() => send('archive:downloadAsZip')} ${state.archive.numPeers ? '' : 'disabled'}>
              <div class="btn__icon-wrapper ${state.archive.numPeers ? '' : 'disabled'}">
                <img src="/public/img/download.svg" class="btn__icon-img">
                <span class="btn__icon-text">Download</span>
              </div>
            </button>
            <a href="dat://${state.archive.key}" class="dat-header-action">
              <div class="btn__icon-wrapper">
                <img src="/public/img/open-in-desktop.svg" class="btn__icon-img">
                <span class="btn__icon-text">Open in Desktop App</span>
              </div>
            </a>
          </div>
          <div id="title" class="share-link">${state.archive.metadata.title || state.archive.key}</div>
          <div id="author" class="author-name">${state.archive.metadata.author}</div>
          ${error(state.archive.error)}
          <div class="dat-details">
            <div id="permissions" class="dat-detail">${permissions({owner: state.archive.instance ? state.archive.instance.owner : false})}</div>
            <div id="hyperdrive-size" class="dat-detail"><p class="size">${size}</p></div>
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
