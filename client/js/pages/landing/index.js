const html = require('choo/html')
const header = require('./../../components/header')

const landingPage = (state, prev, send) => {
  return html`
    <div class="landing">
      ${header(state, prev, send)}
      <h3>Welcome.</h3>
    </div>`
}

module.exports = landingPage
