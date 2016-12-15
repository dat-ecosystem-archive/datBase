const html = require('choo/html')
const header = require('../components/header')
const four = require('../elements/404')

module.exports = function (state, prev, send) {
  return html`
    <div>
      ${header(state, prev, send)}
      ${four()}
    </div>
  `
}
