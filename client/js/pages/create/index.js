const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <div class="create-page">
        <div class="container create-container">
          <h2>Create a new dat</h2>
          <p>A dat contains all of the files for your project, including the version history.</p>
          <div class="row">
              ${importButton({
                handler: function (link) { window.location.href = '/view/' + link }
              })}
          </div>
        </div>
        <div class="side-by-side">
          <div class="row">
          <a href="https://github.com/datproject/dat-desktop" target="_blank">
            <img src="/public/img/logo-dat-desktop-dark.svg" />
            <h2>Download for Mac</h2>
          </a>
          </div>
          <div class="row">
          <a href="http://docs.datproject.org" target="_blank">
            <img src="/public/img/terminal-icon.png" />
            <h2>In the terminal</h2>
          </a>
          <code>
          $ npm install -g dat<br>
          $ dat create path/to/my/data<br>
          $ dat sync path/to/my/data
          </code>
          </div>
        </div>
      </div>
    </div>`
}

module.exports = createPage
