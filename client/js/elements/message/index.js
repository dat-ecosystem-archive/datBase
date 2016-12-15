const html = require('choo/html')

module.exports = function (props) {
  // XXX TODO: https://github.com/datproject/design/issues/20
  return html`<div class="message ${props.type}">
    ${props.message}
  </div>`
}
