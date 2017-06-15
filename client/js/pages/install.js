const html = require('choo/html')
const header = require('../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
    ${header(state, prev, send)}

    <section class="section bg-splash-02" id="desktop">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-6 flex flex-column justify-center">
            <h2 class="content-title horizontal-rule">
            Powerful dataset sharing from your desktop.
            </h2>
            <p class="mb4">
              Share and version control data with ease using our desktop app. Available for Mac and Linux, with Windows coming soon.
            </p>
            <p>
              <a href="http://datproject.github.io/dat-desktop/mac" target="_blank" class="btn btn--green btn--full mb1">
                Download for Mac
              </a>
              <a href="http://datproject.github.io/dat-desktop/linux" target="_blank" class="btn btn--green mb1">
                Download for Linux
              </a>
            </p>
            <p class="color-neutral-50">
               Windows coming soon.
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
            <div class="pa2 bg-neutral screenshot">
              <img src="/public/img/dat-gif.gif" />
            </div>
          </div>
          <div class="col-xs-12 col-sm-6 col-sm-offset-1 flex flex-column justify-center">
            <h2 class="color-white content-title horizontal-rule">
              From the Terminal
            </h2>
            <p class="color-white">
            A Dat Archive contains all of the files for your project, including the version history.
             Dat will watch files as you change them and send them to peers. Install Dat in the terminal using npm.</p>
            <pre class="color-white"><code>$ npm install -g dat
$ dat share path/to/my/data</code></pre>
            <a href="http://docs.datproject.org" target="_blank" class="color-pink hover-color-white">
              See detailed instructions »
            </a>
          </div>
        </div>
      </div>
    </section>
    </div>`
}

module.exports = createPage
