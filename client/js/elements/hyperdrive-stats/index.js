const html = require('choo/html')
const prettyBytes = require('pretty-bytes')

module.exports = function (props) {
  if (!props.downloaded && !props.uploaded) return ''
  return html`<span> ↓ ${prettyBytes(props.downloaded || 0)} / ↑ ${prettyBytes(props.uploaded || 0)}</span>`
}
