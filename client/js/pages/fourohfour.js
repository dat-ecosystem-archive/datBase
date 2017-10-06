const html = require('choo/html')
const wrapper = require('./wrapper')
const four = require('../elements/404')

module.exports = wrapper(function fourohfour (state, emit) {
  emit(state.events.DOMTITLECHANGE, '404 - Page Not Found')
  return html`
    <div>
      ${four()}
    </div>
  `
})
