const html = require('choo/html')

module.exports = (props, click) => {
  if (typeof click === 'function') props.click = click
  var child
  if (props.icon) {
    child = html`<div class="btn__icon-wrapper ${props.disabled ? 'disabled' : ''}"><img class="btn__icon-img" src="${props.icon}" /><span class="btn__icon-text">${props.text}</span></div>`
  } else {
    child = props.text
  }
  return html`
    <button onclick=${props.click} class="${props.klass}" ${props.disabled ? 'disabled' : ''}>
      ${child}
    </button>`
}
