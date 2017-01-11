const html = require('choo/html')
const header = require('./../../components/header')

module.exports = (state, prev, send) => {
  send('user:loginPanel', true)
  return html`
    <div class="landing">
      ${header(state, prev, send)}
    </div>`
}
