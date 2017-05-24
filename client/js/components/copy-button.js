const html = require('choo/html')
const css = require('sheetify')
const Clipboard = module.parent ? null : require('clipboard')

var copyButton = css`
  :host {
    display: inline-block;
    line-height: 1.25;
    padding: 1rem;
    font-size: .875rem;
    background-color: transparent;
    color: var(--color-neutral-60);
    .btn__icon-img {
      width: 1.25rem;
      max-height: 1rem;
    }
  }
`

module.exports = function (text, send) {
  if (module.parent) return html``
  var el = html`
    <a class="clipboard ${copyButton}" data-clipboard-text="${text}">
      <div class="btn__icon-wrapper">
        <svg class="btn__icon-img"><use xlink:href="#daticon-link" /></svg>
        <span class="btn__icon-text">Copy Link</span>
      </div>
    </a>
  `
  var clipboard = new Clipboard('a.clipboard')
  clipboard.on('success', function () {
    send('message:success', 'Link copied to clipboard')
  })
  return el
}
