const html = require('choo/html')
const Clipboard = module.parent ? null : require('clipboard')

module.exports = function (dat, send) {
  if (module.parent) return html``
  var el = html`
    <div class="clipboard btn__icon-wrapper" data-clipboard-text="${dat.url}">
      <img src="/public/img/clipboard.svg" class="btn__icon-img"/>
    </div>
  `
  var clipboard = new Clipboard(el)
  clipboard.on('success', function () {
    send('message:success', 'Copied to cliboard!')
  })
  return el
}
