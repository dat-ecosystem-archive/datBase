const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <section class="section">
        <div class="container">
          <h1 class="content-title horizontal-rule">Creating New Dats</h1>
          <p class="measure-wide mx">A Dat contains all of the files for your project, including the version history. You can create your own fresh Dat using either our Desktop App or the CLI. You can also import an existing Dat by entering the dat link.</p>
        </div>
      </section>
      <section class="section bg-neutral-04">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <div class="import-block">
                <svg>
                  <use xlink:href="#daticon-create-new-dat" />
                </svg>
                ${importButton({
                  handler: function (link) { window.location.href = '/view/' + link }
                })}
              </div>
            </div>
            <div class="col-xs-12 col-sm-6">
              <h2>Import an Existing Dat</h2>
              <p>If you have the link to an existing Dat, import it right here.</p>
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-blue">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <h2 class="color-white">Dat Desktop</h2>
              <p class="color-neutral-10">Sync and stream data using our desktop app.</p>
              <a href="https://github.com/datproject/dat-desktop" target="_blank" class="btn btn--green">
                Download Dat Desktop
              </a>
            </div>
            <div class="col-xs-12 col-sm-6">
              <img src="/public/img/screenshot-dat-desktop.png" />
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-neutral-04">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <img src="/public/img/dat-terminal.svg" />
            </div>
            <div class="col-xs-12 col-sm-6">
            <h2>Dat CLI</h2>
            <p>Use Dat in the terminal.</p>
            <pre>
              <code>
$ npm install -g dat
$ dat create path/to/my/data
$ dat sync path/to/my/data
              </code>
            </pre>
            <a href="http://docs.datproject.org" target="_blank" class="btn btn--green">
              Read full documentation
            </a>
            </div>
          </div>
        </div>
      </section>
    </div>`
}

module.exports = createPage
