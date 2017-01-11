const html = require('choo/html')
const list = require('./../../components/list')
const header = require('./../../components/header')

const listPage = (state, prev, send) => {
  return html`
  <div>
    ${header(state, prev, send)}
    <div class="container">
    ${list(state, prev, send)}
    </div>
  </div>`
}

module.exports = listPage
