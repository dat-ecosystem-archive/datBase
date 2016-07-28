const html = require('choo/html')

const mainView = (state, prev, send) => {
  return html`<div class="tmp-main-view"
       style="background: orange; padding: 50px;">
      <h1>Main View:</h1>
      <h2>${state.location}</h2>
      archive key: ${state.archive.key} <br />
      file: ${state.archive.file}
      </div>`
}

module.exports = mainView
