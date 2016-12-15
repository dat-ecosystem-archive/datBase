const html = require('choo/html')
const icon = require('../icon')

module.exports = function (props) {
  if (!props) props = {}
  props.header = props.header || '404'
  props.body = props.body || 'We could not find the droids you were looking for. Is the link correct?'
  props.onclick = props.onclick || ''
  props.linkText = props.linkText || 'Take me home'
  var button = ''
  if (props.link) {
    button = html`<p class="mb4">
     <button onclick="${props.onclick}"
        class="btn btn--large btn--green take-me-home"
        href="/">${props.linkText}</button>
    </p>`
  }
  return html`
    <div>
    <div class="error-page">
      <div class="mb3">
        ${icon('sad-dat')}
      </div>
      <h3>${props.header}</h3>
      <p class="mb3">${props.body}</p>
      ${button}
     </div>
   </div>`
}
