const html = require('choo/html')
const header = require('./../../components/header')
const importButton = require('./../../elements/import-button')

const createPage = (state, prev, send) => {
  return html`
    <div>
    ${header(state, prev, send)}

    <section class="section bg-nuetral-04" id="desktop">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-6 flex flex-column justify-center">
            <h2 class="content-title horizontal-rule">
              Download Dat Desktop
            </h2>
            <p class="mb4">
              To manage multiple Dats on your desktop machine, use our app.
              Coming soon for all platforms.
            </p>
            <p>
              <a href="http://github.com/datproject/dat-desktop" target="_blank" class="btn btn--green">
                View on GitHub
              </a>
            </p>
          </div>
          <div class="col-xs-12 col-sm-6 flex flex-column justify-center">
            <img src="/public/img/screenshot-dat-desktop.png" class="screenshot" />
          </div>
        </div>
      </div>
    </section>
    <section class="section bg-blue" id="terminal">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-5 flex flex-column justify-center">
            <div class="p2 bg-neutral screenshot">
              <img src="/public/img/dat-gif.gif" />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-sm-offset-1 flex flex-column justify-center">
            <h2 class="color-white content-title horizontal-rule">
              Install Dat CLI
            </h2>
            <p class="color-white">
            A Dat Archive contains all of the files for your project, including the version history.
             Dat will watch files as you change them and send them to peers. Install Dat in the terminal using npm.</p>
            <pre class="color-white"><code>$ npm install -g dat
$ dat share path/to/my/data</code></pre>
            <a href="http://docs.datproject.org" target="_blank" class="">
            See detailed instructions
            </a>
          </div>
        </div>
      </div>
    </section>
      <section class="section">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-5 flex flex-column justify-center">
              <h2 class="content-title horizontal-rule">All the ways to use Dat</h2>
              <p class="measure-wide">
                Share your link through the web using the “Open Dat Link” box.
                On MacOS you can also share files using Dat Desktop, coming soon to more platforms.
                Or install our Command Line Tool, Dat CLI.
              </p>
            </div>
            <div class="col-xs-12 col-sm-7">
              <div class="row">
                <div class="col-xs-12">
                  <div class="bg-green mb4 p3 block-create block-create--import">
                    <svg class="block-create__icon" >
                      <use xlink:href="#daticon-import-dat" />
                    </svg>
                  <p class="mb0 f6 lh-title color-white">
                    You can view an existing Dat <br>by entering the dat link.</p>
                    ${importButton({
                      handler: function (link) { window.location.href = '/dat/' + link }
                    })}
                  </div>
                </div>
                <div class="col-xs-6">
                <a href="#desktop">
                  <div class="bg-blue hover-bg-blue-hover mb4 p3 block-create">
                    <svg class="block-create__icon">
                      <use xlink:href="#daticon-open-in-desktop" />
                    </svg>
                    <p class="mb0 f6 lh-title color-white">Desktop App coming soon</p>
                  </div>
                </a>
                </div>
                <div class="col-xs-6">
                <a href="#terminal">
                  <div class="bg-neutral hover-bg-neutral-80 mb4 p3 block-create">
                    <img src="/public/img/terminal-icon.svg" class="block-create__icon" />
                    <p class="mb0 f6 lh-title color-white">In the Terminal</p>
                  </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>`
}

module.exports = createPage
