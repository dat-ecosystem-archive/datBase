const html = require('choo/html')
const header = require('./../../components/header')
const login = require('./../../components/auth/login')

module.exports = (state, prev, send) => {
  return html`
    <div class="landing">
      ${header(state, prev, send)}
      ${login(state, prev, send)}
    </div>`
}
