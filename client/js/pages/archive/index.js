const html = require('choo/html')
const hyperdrive = require('../../components/hyperdrive')
const permissions = require('../../components/permissions')
const header = require('../../components/header')
const error = require('../../elements/error')

const archivePage = (state, prev, send) => {
  // TODO: style the error handling
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="archive-metadata">
        <h1>ArchivePage</h1>
        <h2>Server-rendered properties:</h2>
        ${error(state.archive.error)}
        <ul>
        <li>archive key: ${state.archive.key}</li>
        <li>peers: ${state.archive.numPeers}</li>
        <li>${permissions(state, prev, send)}</li>
        <li>signalhubs:
          <ul>
          ${state.archive.signalhubs.map(function (fqdn) {
            return signalhubs(fqdn)
          })}
          </ul>
        </li>
        </ul>
      </div>
      <main id="archive-list" class="container">
        ${hyperdrive(state, prev, send)}
      </main>
    </div>`
}

const signalhubs = (fqdn) => {
  return html`<li>- ${fqdn}</li>`
}

module.exports = archivePage
