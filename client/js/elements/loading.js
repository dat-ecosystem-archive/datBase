const html = require('choo/html')
const loaderIcon = require('./loader-icon')

module.exports = function () {
  return html`<div class="loading">
    <div class="error-page">
      <div class="mb3">
        ${loaderIcon()}
      </div>
      <h3>Loading…</h3>
     </div>
  `
}
