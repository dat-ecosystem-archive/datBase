const html = require('choo/html')
const header = require('../components/header')
const four = require('../elements/404')

module.exports = function (state, emit) {
  return html`
    <div>
      ${header(state, emit)}
      ${four()}
    </div>
  `
}
