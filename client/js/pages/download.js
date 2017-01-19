const html = require('choo/html')
const header = require('../components/header')

module.exports = function (state, prev, send) {
  return html`
    <div>
      ${header(state, prev, send)}
      <section class="section">
        <div class="container">
          <h1>Download a dat</h1>
          <div class="row">
            <p>1. Install node for your platform using <a href="http://nodejs.org">this link.</a></p>
          </div>
          <div class="row">
            <p>2. clone the dat</p>
            <pre><code>
$ npm install -g dat
$ dat clone ${state.archive.key}
            </code></pre>

          <p>Having trouble installing dat? Try our <a href="http://docs.datproject.org/#troubleshooting">troubleshooting checklist</a>.</p>

          </div>
        </div>
    </section>
  </div>
  `
}
