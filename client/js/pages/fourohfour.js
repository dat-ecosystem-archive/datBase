const html = require('choo/html')
const wrapper = require('./wrapper')
const four = require('../elements/404')

module.exports = wrapper(function fourohfour (state, emit) {
  return html`
    <div>
      ${four()}
    </div>
  `
})
