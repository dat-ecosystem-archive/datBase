const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const dropzone = require('./../../components/dropzone')
const css = require('sheetify')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  const prefix = css`
    :host {
      display: flex;

      .box {
        padding: 20px;
        margin: 20px;
      }

      .row {
        margin-top: 10px;
      }
      h5 {
        margin-bottom: 5px;
      }
      .landing-create-new-dat {
        text-align: center;
        a {
          color: inherit;
        }
        a:hover { 
          background-color: #293648;
          color: #eee;
        }
      }
    }
  `
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="container ${prefix}">
      <div class="box">
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
            $ dat path/to/my/data
          </code>
        </div>
        <div class="row">
          <h5>3. Share the link (dat://):</h5>
          ${importButton({
            handler: function (link) { window.location.href = '/view/' + link }
          })}
        </div>
      </div>
      ${dropzone(state, prev, send)}
    </div>
    </div>`
}

module.exports = createPage
