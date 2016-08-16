const html = require('choo/html')
const prettyBytes = require('pretty-bytes')

module.exports = function ({downloaded, uploaded}) {
  return html`<span>Total: ↓ ${prettyBytes(downloaded || 0)} / ↑ ${prettyBytes(uploaded || 0)}</span>`
}
