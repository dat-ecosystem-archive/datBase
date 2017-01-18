const css = require('sheetify')
const gravatar = require('../../elements/gravatar')
const html = require('choo/html')

module.exports = function (state, prev, send) {
  if (state.user.username === prev && prev.user.username) return
  const prefix = css`
    :host {


    }
  `
  return html`<div class="user-panel ${prefix} ${state.user.sidePanel}">
    <div class="top-part">
      <a class="close" href="#" onclick=${() => send('user:sidePanel')}></a>
      ${gravatar(state.user)}
      ${state.user.email}
    </div>
    <div class="body-part">
      <div class="content">
        <ul>
          <h4>My Dats</h4>
          ${state.user.dats.map(dat => {
            return html`<li><a href="/${state.user.username}/${dat.name}">${dat.name}</a></li>`
          })}
        </ul>
      </div>
      <div class="footer-part">
        <button class="btn btn--large btn--green" onclick=${() => send('user:logout', {})}>LOGOUT</button>
        <p>Dat Project v${state.user.version}</p>
        <p><span><a href="http://github.com/datproject/datfolder/issues" target="_blank">Report Bug</a> |
        <a href="http://github.com/datproject/datfolder" target="_blank">Contribute</a></span></p>
      </div>
    </div>
  </div>`
}
