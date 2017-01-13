const html = require('choo/html')
const Clipboard = module.parent ? null : require('clipboard')

module.exports = function (text, send) {
  if (module.parent) return html``
  var el = html`
    <div class="clipboard btn__icon-wrapper" data-clipboard-text="${text}">
      <svg><use xlink:href="#daticon-link" /></svg>
      <span class="btn__icon-text">Copy Link</span>
    </div>
  `
  var clipboard = new Clipboard(el)
  clipboard.on('success', function () {
    send('message:success', 'Copied to clipboard!')
  })
  return el
}
