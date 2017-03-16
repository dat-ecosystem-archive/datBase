const html = require('choo/html')
const Clipboard = module.parent ? null : require('clipboard')

module.exports = function (text, send) {
  if (module.parent) return html``
  var el = html`
    <a class="clipboard dat-header-action" data-clipboard-text="${text}">
      <div class="btn__icon-wrapper">
        <svg><use xlink:href="#daticon-link" /></svg>
        <span class="btn__icon-text">Copy Link</span>
      </div>
    </a>
  `
  var clipboard = new Clipboard(el)
  clipboard.on('success', function () {
    send('message:success', 'Copied to clipboard!')
  })
  return el
}
