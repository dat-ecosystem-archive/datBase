const html = require('choo/html')
const importButton = require('./../../elements/import-button')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
      ${header(state, prev, send)}
      <section class="section">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-5">
              <h1 class="f1 content-title horizontal-rule">Creating New Dats</h1>
              <p class="measure-wide">A Dat contains all of the files for your project, including the version history. You can import an existing Dat by entering the dat link. Or create your own fresh Dat using either our Desktop App or the CLI.</p>
            </div>
            <div class="col-xs-12 col-sm-7">
              <div class="row">
                <div class="col-xs-12">
                  <div class="bg-green mb4 p3 block-create block-create--import">
                    <svg>
                      <use xlink:href="#daticon-import-dat" />
                    </svg>
                    ${importButton({
                      handler: function (link) { window.location.href = '/view/' + link }
                    })}
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="bg-blue mb4 p3 block-create">
                    <svg>
                      <use xlink:href="#daticon-open-in-desktop" />
                    </svg>
                    <p class="mb0 pv1 color-white">Coming soon for MacOS!</p>
                    <!-- <a href="https://github.com/datproject/dat-desktop" target="_blank" class="btn btn--green">
                      Download Dat Desktop
                    </a> -->
                  </div>
                </div>
                <div class="col-xs-6">
                  <div class="bg-neutral mb4 p3 block-create">
                    <svg>
                      <use xlink:href="#daticon-create-new-dat" />
                    </svg>
                    <a href="http://docs.datproject.org" target="_blank" class="btn btn--green">
                      Use the Dat CLI
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="section bg-neutral-04">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <img src="/public/img/dat-terminal.svg" class="screenshot" />
            </div>
            <div class="col-xs-12 col-sm-6">
              <h2 class="content-title horizontal-rule">
                Dat CLI
              </h2>
              <p>Use Dat in the terminal. [Some more explanatory copy]</p>
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
      <section class="section bg-blue">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6">
              <h2 class="content-title color-white horizontal-rule">
                Dat Desktop
              </h2>
              <p class="color-white">Sync and stream data using our desktop app.</p>
              <p class="color-white">Coming soon for MacOS!</p>
              <!-- <a href="https://github.com/datproject/dat-desktop" target="_blank" class="btn btn--green">
                Download Dat Desktop
              </a> -->
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
