const html = require('choo/html')
const prettyBytes = require('pretty-bytes')

module.exports = function (props) {
  return html`<span>Total: ↓ ${prettyBytes(props.downloaded || 0)} / ↑ ${prettyBytes(props.uploaded || 0)}</span>`
}
