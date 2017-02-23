const html = require('choo/html')

module.exports = function (props) {
  return html`<div>${props.owner
            ? 'Owner'
            : ''}</div>`
}
