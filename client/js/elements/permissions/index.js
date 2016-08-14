const html = require('choo/html')

module.exports = function (props) {
  return html`<div>${props.owner
            ? 'Read & Write'
            : 'Read only'}</div>`
}
