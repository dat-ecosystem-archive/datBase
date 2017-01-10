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
      <a class="close" href="#" onclick=${() => send('user:panel')}></a>
      ${gravatar(state.user)}
      ${state.user.email}
    </div>
    <div class="body-part">
    <ul>
      <li>List item #1</li>
      <li>List item #2</li>
    </ul>
    </div>
    <div class="footer-part">
      <button class="btn btn--large btn--green" onclick=${() => send('user:logout', {})}>LOGOUT</button>
      <p>DatLand TODO version</p>
      <p><span><a href="http://github.com/datproject/datfolder/issues" target="_blank">Report Bug</a> |
      <a href="http://github.com/datproject/datfolder" target="_blank">Contribute</a></span></p>
    </div>
  </div>`
}
