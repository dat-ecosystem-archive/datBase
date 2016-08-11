var html = require('choo/html')

module.exports = (error) => {
  if (error) return html`<div class="error">${error.message}</div>`
  else return html``
}
