const html = require('choo/html')
const header = require('./../../components/header')
const importButton = require('./../../elements/import-button')

const createPage = (state, prev, send) => {
  return html`
    <div>
    ${header(state, prev, send)}
      <section class="section">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-5">
              <h1 class="f1 content-title horizontal-rule">Using Dat</h1>
              <p class="measure-wide">A Dat Archive contains all of the files for your project, including the version history.
              Create your own Dat using either our Desktop App or the CLI.</p>
            </div>
            <div class="col-xs-12 col-sm-7">
              <div class="row">
                <div class="col-xs-12">
                  <div class="bg-green mb4 p3 block-create block-create--import">
                    <svg class="block-create__icon" >
                      <use xlink:href="#daticon-import-dat" />
                    </svg>
                  <p class="mb0 f6 lh-title color-white">  You can view an existing Dat <br>by entering the dat link.</p>
                    ${importButton({
                      handler: function (link) { window.location.href = '/view/' + link }
                    })}
                  </div>
                </div>
                <div class="col-xs-6">
                <a href="#desktop">
                  <div class="bg-blue mb4 p3 block-create">
                    <svg class="block-create__icon">
                      <use xlink:href="#daticon-open-in-desktop" />
                    </svg>
                    <p class="mb0 f6 lh-title color-white">Desktop App coming soon</p>
                  </div>
                </a>
                </div>
                <div class="col-xs-6">
                <a href="#terminal">
                  <div class="bg-neutral mb4 p3 block-create">
                    <img src="/public/img/terminal-icon.svg" class="block-create__icon" />
                    <p class="mb0 f6 lh-title color-white">On the terminal</p>
                  </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-neutral-04" id="terminal">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <img src="/public/img/dat-terminal.svg" class="screenshot" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <h2 class="content-title horizontal-rule">
                On the terminal
              </h2>
              <p>Use Dat in the terminal. Dat will watch and sync files as you change them.</p>
              <pre><code>$ npm install -g dat
$ dat share path/to/my/data</code></pre>
              <a href="http://docs.datproject.org" target="_blank" class="btn btn--green">
                Read full documentation
              </a>
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-blue" id="desktop">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <h2 class="content-title color-white horizontal-rule">
                Dat Desktop
              </h2>
              <p class="color-white">Sync data using our desktop app.</p>
              <p class="color-white">To manage multiple dats on your desktop machine, use the app, coming soon for all platforms. </p>
              <a href="http://github.com/datproject/dat-desktop" target="_blank" class="btn btn--green">
                View on GitHub
              </a>
            </div>
            <div class="col-xs-12 col-sm-6">
              <img src="/public/img/screenshot-dat-desktop.png" class="screenshot" />
            </div>
          </div>
        </div>
      </section>
    </div>`
}

module.exports = createPage
