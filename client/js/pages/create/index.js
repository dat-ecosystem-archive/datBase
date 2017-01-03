const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const dropzone = require('./../../components/dropzone')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="container">
        <h1>Share data persistently</h1>
        <div class="row">
        <h5>1. Install dat</h5>
          <code>
            $ npm install -g dat
          </code>
        </div>
        <div class="row">
          <h5>2. Create an archive</h5>
          <code>
            $ dat create path/to/my/data<br>
            $ dat sync path/to/my/data
          </code>
        </div>
        <div class="row">
          <h5>3. Share the link (dat://):</h5>
          ${importButton({
            handler: function (link) { window.location.href = '/view/' + link }
          })}
        </div>
        <div class="landing-main">
          <h1>Share one time and throw it away</h1>
          ${dropzone(state, prev, send)}
        </div>
      </div>
    </div>`
}

module.exports = createPage
