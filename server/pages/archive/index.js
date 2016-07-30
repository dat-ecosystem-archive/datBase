const html = require('choo/html')
const header = require('./../../components/header')

const archivePage = (state, prev) => {
  return html`<html>
    <head>
      <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
      <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
    </head>
    <body>
      ${header(state, prev)}
      <div class="tmp-archive-view">
        <h1>ArchivePage</h1>
        <h2>Server-rendered properties:</h2>
        <ul>
        <li>archive key: ${state.archive.key}</li>
        <li>peers: ${state.archive.numPeers}</li>
        <li>signalhubs:
          <ul>
          ${state.signalhubs.map(function (fqdn) {
            return signalhubs(fqdn)
          })}
          </ul>
        </li>
        </ul>
      <script type="text/javascript" src="public/js/app.js"></script>
    </body></html>`
}

const signalhubs = (fqdn) => {
  return html`<li>- ${fqdn}</li>`
}

module.exports = archivePage
