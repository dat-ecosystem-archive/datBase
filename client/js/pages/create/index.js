const html = require('choo/html')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="landing-main container">
        Create some datasets

      </div>
    </div>`
}

module.exports = createPage
