const html = require('choo/html')
const hyperdrive = require('../../components/hyperdrive')
const permissions = require('../../elements/permissions')
const addFiles = require('../../elements/add-files')
const header = require('../../components/header')
const error = require('../../elements/error')
const hyperdriveStats = require('../../elements/hyperdrive-stats')
const prettyBytes = require('pretty-bytes')
const preview = require('../../components/preview')

const archivePage = (state, prev, send) => {
  // XXX: have an error enum?
  if (state.archive.error && state.archive.error.message === 'Invalid key') {
    // TODO: update below HTML
    return html`
      <div>
        ${header(state, prev, send)}
        <img src="./public/img/dat-data-logo.svg" />
        <h2>404 - Sorry, no dat here.</h2>
        <h3>We couldn't find the droids you were looking for. Is the link correct?</h3>
        <button class="btn btn--green take-me-home" href="/">Take me home</button>
      </div>`
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
          <ul>
          <li>signalhubs:
            <ul>
            ${state.archive.signalhubs.map(function (fqdn) {
              return signalhubs(fqdn)
            })}
            </ul>
          </li>
          </ul>
          <div class="dat-details">
            <div id="permissions" class="dat-detail">${permissions({owner: state.archive.instance ? state.archive.instance.owner : false})}</div>
            <div id="hyperdrive-size" class="dat-detail"><p id="size">${prettyBytes(state.archive.size || 0)}</p></div>
            <div id="peers" class="dat-detail">${state.archive.numPeers} Source(s)</div>
            <div style="display: none;" id="speed" class="dat-detail dat-detail--speed"><div>
              <span id="download-speed"></span> / <span id="upload-speed"></span>
            </div></div>
          </div>
        </div>
      </div>
      <main id="site-main">
        <div class="container">
          <div id="add-files">${state.archive.instance && state.archive.instance.owner ? addFiles({ onfiles: (files) => send('archive:importFiles', {files}) }) : ''}</div>
          <div id="file-queue">XXX: file queue</div>
          ${hyperdrive(state, prev, send)}
        </div>
      </main>
      <div class="status-bar">
        <div class="container">
          <span id="help-text" class="status-bar-status"></span>
          <div style="display: block;" id="hyperdrive-stats" class="status-bar-stats">
            ${hyperdriveStats({ downloaded: state.archive.downloaded, uploaded: state.archive.uploaded })}
          </div>
        </div>
      </div>
      ${preview(state, prev, send)}
    </div>`
}

const signalhubs = (fqdn) => {
  return html`<li>- ${fqdn}</li>`
}

module.exports = archivePage
