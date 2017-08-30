const html = require('choo/html')
const header = require('../components/header')
const footer = require('../elements/footer')

module.exports = function (view, opts) {
  return function (state, emit) {
    return html`
      <div class="min-vh-100 pb7">
        ${header(state, emit)}
        ${view(state, emit)}
        ${footer()}
      </div>
    `
  }
}
