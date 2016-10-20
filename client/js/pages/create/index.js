const html = require('choo/html')
const header = require('./../../components/header')

const landingPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="landing-main container">
        <h3>Create New Dat</h3>
        <p>i've got some instructions for you</p>
      </div>
    </div>`
}

module.exports = landingPage
