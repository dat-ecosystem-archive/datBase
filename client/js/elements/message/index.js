const html = require('choo/html')
const css = require('sheetify')

module.exports = function (props) {
  if (!props.message) return html``

  var prefix = css`
    :host {
      position: fixed;
      top: 0;
      opacity: .9;
      height: 40px;
      line-height: 40px;
      width: 100%;
      text-align: center;
      z-index: 999;
      &.success {
        background-color: green;
      }
      &.error {
        background-color: red;
      }
      &.warning {
        background-color: yellow;
      }
    }
  `
  return html`<div class="${prefix} ${props.type}">
    ${props.message}
  </div>`
}
