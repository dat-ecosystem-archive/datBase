const html = require('choo/html')
const header = require('./../../components/header')
const drop = require('drag-drop')

module.exports = (state, prev, send) => {
  return html`<div class="landing-create-new-dat" onload=${
    (el) => drop(el, (files) => send('archive:importFiles', {files, createArchive: 1}))
  }>
    <h3>Create New Dat</h3>
    <p>
      Drag and drop files to upload and start sharing your data
    </p>
  </div>`
}
