const html = require('choo/html')

const mainView = (state, prev, send) => {
  return html`<div class="tmp-main-view">
      temporary mainView: <br />
      archive key: ${state.archive.key} <br />
      file: ${state.archive.file}
    </div>`
}

module.exports = mainView
