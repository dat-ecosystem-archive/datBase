const html = require('choo/html')

module.exports = function (props) {
  if (!props.message) return html``
  return html`<div class="message ${props.type}">
    ${props.message}
  </div>`
}
