'use strict'
const html = require('choo/html')

module.exports = (props, click) => {
  if (typeof click === 'function') props.click = click
  return html`
    <button onclick=${props.click} class="btn ${props.klass || 'btn--green'}">
      ${props.text}
    </button>
  `
}
