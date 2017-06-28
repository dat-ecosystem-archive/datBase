const html = require('choo/html')
const register = require('./../../components/auth/register')
const header = require('./../../components/header')

module.exports = (state, emit) => {
  return html`
    <div class="landing">
      ${header(state, emit)}
      ${register(state, emit)}
    </div>`
}
