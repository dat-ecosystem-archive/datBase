const html = require('choo/html')
const drop = require('drag-drop')

module.exports = (state, prev, send) => {
  return html`<div class="landing-create-new-dat" onload=${
    (el) => drop(el, (files) => send('archive:importFiles', {files, createArchive: 1}))
  }>

    <a class="share-button" onclick=${() => send('archive:new')}><h3>Share browser-to-browser</h3>
    <p>Drag and drop files to upload and start sharing your data.</p>
    </a>
  </div>`
}
