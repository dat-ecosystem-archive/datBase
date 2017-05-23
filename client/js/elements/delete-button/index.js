const html = require('choo/html')

module.exports = function (remove) {
  return html`
    <div id="delete" class="hover-color-red delete-btn" onclick="${remove}">
      <svg><use xlink:href="#daticon-trash" /></svg>
      <span class="btn__icon-text">Delete</span>
    </a>
  `
}
