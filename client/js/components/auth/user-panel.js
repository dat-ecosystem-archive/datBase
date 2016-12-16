const css = require('sheetify')
const gravatar = require('../../elements/gravatar')
const html = require('choo/html')

module.exports = function (state, prev, send) {
  if (state.user.username === prev && prev.user.username) return
  const prefix = css`
    :host {


    }
  `
  return html`<div class="user-panel ${prefix} ${state.user.panel}">
    <div class="top-part">
      ${gravatar(state.user)}
    </div>
    <div class="body-part">
    <ul>
      <li>List item #1</li>
      <li>List item #2</li>
    </ul>
    <button onclick=${() => send('user:logout', {})}>Logout</button>
    </div>
    <div class="footer-part">
      DatLand version 1.0.0 // TODO: get real version number
      <span><a href="http://github.com/datproject/datfolder/issues" target="_blank">Report Bug</a> |
      <a href="http://github.com/datproject/datfolder" target="_blank">Contribute</a></span>
    </div>
  </div>`
}
