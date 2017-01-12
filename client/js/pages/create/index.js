const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <section>
        <div class="container">
          <h2>Create A New Dat</h2>
          <p>A dat contains all of the files for your project, including the version history.</p>
          <div>
            ${importButton({
              handler: function (link) { window.location.href = '/view/' + link }
            })}
          </div>
      </section>
      <section class="bg-neutral-04">
        <div class="container">
          <h2>Dat Desktop</h2>
          <a href="https://github.com/datproject/dat-desktop" target="_blank">
            <img src="/public/img/logo-dat-desktop-dark.svg" />
            <p>Download for Mac</p>
          </a>

          <h2>Dat CLI</h2>
          <a href="http://docs.datproject.org" target="_blank">
            <img src="/public/img/terminal-icon.png" />
            <p>Use Dat in the terminal</p>
          </a>
          <code>
            $ npm install -g dat<br>
            $ dat create path/to/my/data<br>
            $ dat sync path/to/my/data
          </code>
        </div>
      </section>
    </div>`
}

module.exports = createPage
