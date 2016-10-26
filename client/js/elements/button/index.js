'use strict'
const html = require('choo/html')
const icon = require('../icon')

module.exports = (props, click) => {
  if (typeof click === 'function') props.click = click
  var child
  if (props.icon) {
    child = icon(props.icon)
  } else {
    child = props.text
  }
  return html`
    <button onclick=${props.click} class="${props.klass}" ${props.disabled ? 'disabled' : ''}>
      ${child}
    </button>`
}
