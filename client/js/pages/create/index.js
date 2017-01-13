const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <section class="section">
        <div class="container">
          <h2>Create A New Dat</h2>
          <p>A Dat contains all of the files for your project, including the version history.</p>
          <div>
            ${importButton({
              handler: function (link) { window.location.href = '/view/' + link }
            })}
          </div>
        </div>
      </section>
      <section class="section bg-neutral-04">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <h2>Dat Desktop</h2>
              <a href="https://github.com/datproject/dat-desktop" target="_blank">
                <img src="/public/img/logo-dat-desktop-dark.svg" />
                <p>Download for Mac</p>
              </a>
            </div>
            <div class="col-xs-12 col-sm-6">
              <h2>Dat CLI</h2>
              <a href="http://docs.datproject.org" target="_blank">
                <img src="/public/img/dat-terminal.svg" />
                <p>Use Dat in the terminal</p>
              </a>
              <code>
                $ npm install -g dat<br>
                $ dat create path/to/my/data<br>
                $ dat sync path/to/my/data
              </code>
            </div>
          </div>
        </div>
      </section>
    </div>`
}

module.exports = createPage
