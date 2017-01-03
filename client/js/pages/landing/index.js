const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const css = require('sheetify')
const header = require('./../../components/header')

const landingPage = (state, prev, send) => {
  const prefix = css`
    :host {
      .head {
        text-align: center;
      }
      .create {
        width: 340px;
        margin: auto;
      }
      .row {
        margin: 10px 0px;
      }
      img {
        width: 300px;
      }

    }
  `
  return html`
    <div class="landing ${prefix}">
      <div class="head">
        <img src="/public/img/dat-data-logo.svg" />
        <h1>datfolder.org</h1>
        <h3>Share, sync, and update data on the distributed web.</h3>
        <p><a href="https://github.com/datproject/dat-desktop">Desktop App for Mac</a> | <a href="http://docs.datproject.org">Documentation</a></p>
      </div>
      <div class="create">
        <div class="row">
        <h5>1. Install dat</h5>
          <code>
            $ npm install -g dat
          </code>
        </div>
        <div class="row">
          <h5>2. Create a project</h5>
          <code>
            $ dat create path/to/my/data
          </code>
       </div>
        <div class="row">
          <h5>3. Sync the data</h5>
          <code>
            $ dat sync path/to/my/data
          </code>
       </div>
        <div class="row">
          <h5>4. Share the link (dat://):</h5>
          ${importButton({
            handler: function (link) { window.location.href = '/view/' + link }
          })}
        </div>
      </div>
    </div>`
}

module.exports = landingPage
