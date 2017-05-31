const html = require('choo/html')
const css = require('sheetify')

var messageStyles = css`
  :host {
    position: fixed;
    top: 0;
    padding: 1rem 1.5rem;
    width: 100%;
    text-align: center;
    z-index: 999;
    color: var(--color-white);
    &.success {
      background-color: var(--color-blue);
    }
    &.error {
      background-color: var(--color-red);
    }
    &.warning {
      background-color: var(--color-yellow-hover);
    }
  }
`
module.exports = function (props) {
  if (!props.message) return html``
  return html`<div class="${messageStyles} ${props.type}">
    ${props.message}
  </div>`
}
