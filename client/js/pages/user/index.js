const html = require('choo/html')
const header = require('./../../components/header')

module.exports = (state, prev, send) => {
  console.log('hi')
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="landing-main container">
      </div>
    </div>`
}
