const html = require('choo/html')
const header = require('./../../components/header')

module.exports = (state, prev, send) => {
  if (!module.parent) {
    if (!state.user.username) send('user:loginPanel', true)
  }
  return html`
    <div class="landing">
      ${header(state, prev, send)}
      ${state.user.username ? html`<h1>Logged in as ${state.user.username}</h1>` : ''}
    </div>`
}
