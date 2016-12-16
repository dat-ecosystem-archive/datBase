const html = require('choo/html')
const header = require('./../../components/header')
const register = require('./../../components/auth/register')

const landingPage = (state, prev, send) => {
  return html`
    <div class="landing">
      ${header(state, prev, send)}
      <h3>Register</h3>
      ${register(state, prev, send)}
    </div>`
}

module.exports = landingPage
