const html = require('choo/html')

module.exports = function (id, opts) {
  return html`<svg viewBox="0 0 16 16"  class="icon icon-${id}">
    <use xlink:href="#daticon-${id}" />
  </svg>`
}
