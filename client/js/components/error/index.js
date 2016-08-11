var html = require('choo/html')

module.exports = (error, send) => {
  if (error) return html`<div class="error">${error.message}</div>`
  else return html``
}
