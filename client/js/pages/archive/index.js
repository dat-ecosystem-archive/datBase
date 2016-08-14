const html = require('choo/html')
const hyperdrive = require('../../components/hyperdrive')
const permissions = require('../../elements/permissions')
const header = require('../../components/header')
const error = require('../../elements/error')
const prettyBytes = require('pretty-bytes')

const archivePage = (state, prev, send) => {
  // TODO: style the error handling
  return html`
    <div>
      ${header(state, prev, send)}
      <div id="dat-info" class="dat-header">
        <div class="container">
          ${error(state.archive.error)}
          <ul>
          <li>archive key: ${state.archive.key}</li>
          <li>signalhubs:
            <ul>
            ${state.archive.signalhubs.map(function (fqdn) {
              return signalhubs(fqdn)
            })}
            </ul>
          </li>
          </ul>
          <div class="dat-details">
            <div id="permissions" class="dat-detail">${permissions({owner: state.archive ? state.archive.owner : false})}</div>
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
          <div id="add-files">XXX: add files</div>
          <div id="file-queue">XXX: file queue</div>
          ${hyperdrive(state, prev, send)}
        </div>
      </main>
      <div class="status-bar">
        <div class="container">
          <span id="help-text" class="status-bar-status"></span>
          <div style="display: block;" id="hyperdrive-stats" class="status-bar-stats">
            <span>Total: XX kB / XXX kB</span>
          </div>
        </div>
      </div>
    </div>`
}

const signalhubs = (fqdn) => {
  return html`<li>- ${fqdn}</li>`
}

module.exports = archivePage
