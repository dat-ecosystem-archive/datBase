const html = require('choo/html')
const header = require('./../../components/header')
const dropzone = require('./../../components/dropzone')

const landingPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="landing-main container">
        ${dropzone(state, prev, send)}
      </div>
    </div>`
}

module.exports = landingPage
