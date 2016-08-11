const html = require('choo/html')

module.exports = function (state, prev, send) {
  var owner = state.archive ? state.archive.owner : false
  var component = html`<div>${owner
            ? 'Read & Write'
            : 'Read only'}</div>`
  return component
}
