const browser = require('detect-browser');
const html = require('choo/html')
const MIN_VERSION = 52

module.exports = function () {
  if (browser.name === 'chrome' && Number(browser.version.split('.')[0]) >= MIN_VERSION) return html``
  return html`<div class="danger-block pt3">
    <h3 class="mb3">Sorry we don't support your browser (yet).</h1>
    <div  class="pb3">We only support the latest version of Google Chrome. <a href="https://www.google.com/chrome/browser/desktop/" target="_blank">Download</a></div>
    </div>
  `
}
