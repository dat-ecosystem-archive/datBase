const html = require('choo/html')
const register = require('./../../components/auth/register')
const header = require('./../../components/header')

module.exports = (state, prev, send) => {
  if (!module.parent) {
    if (!state.user.username) send('user:update', {register: ''})
  }
  return html`
    <div class="landing">
      ${header(state, prev, send)}
      ${register(state, prev, send)}
    </div>`
}
