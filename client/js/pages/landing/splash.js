var html = require('choo/html')
var header = require('./header')
var footer = require('./footer')

module.exports = function (state, prev, send) {
  return html`
    <div>
      ${header(state, prev, send)}
      <section class="section bg-splash">
  <div class="container">
    <h1 class="mt0 tc normal f2 f1-ns ">
      Powerful data sharing
      <br>
      from your desktop.
    </h1>
    <p class="tc mb4 color-neutral-50">
      Dat is the secure and distributed package manager for data. Use the desktop app, command line tool, and javascript library.
    </p>
    <div class="splash-visual">
      <img src="/public/img/screenshot-dat-desktop.png" />
    </div>
    <p class="tc pv3 color-white">
      <a href="https://github.com/datproject/dat-desktop/releases" class="btn btn--green btn--cta open-desktop" target="_blank">
        <svg><use xlink:href="#daticon-open-in-desktop"/></svg>
        Download for Mac
      </a>
    </p>
    <p class="f7 tc color-neutral-50">
      Coming to Windows soon. <a href="https://github.com/datproject/dat-desktop/releases">Download for Linux</a>.
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-5 col-md-6 flex flex-column justify-center">
        <div class="p2 bg-neutral screenshot">
          <img src="/public/img/dat-gif.gif" />
        </div>
      </div>
      <div class="col-xs-12 col-sm-7 col-md-offset-1 col-md-5 flex flex-column justify-center">
        <h2 class="content-title horizontal-rule">
          From the Terminal
        </h2>
        <p class="measure mb4">
          Dat is the package manager for data. Share files with version control, back up data to servers, browse remote files on demand, and automate long-term data preservation. Secure, distributed, fast.
        </p>
        <p>
          <a href="/install" class="btn btn--green" target="_blank">
            Install Dat CLI
          </a>
        </p>
        <p class="f6">
          <a href="http://docs.datproject.org">
            Read the Docs
          </a>
          <span class="color-pink">&ensp; | &ensp;</span>
          <a href="http://github.com/datproject/">
            View on Github
          </a>
        </p>
      </div>
    </div>
  </div>
</section>

<section class="section bg-neutral-04">
  <div class="container">

    <h2 class="content-title">Shared with Dat</h2>
    <p class="content-subtitle horizontal-rule">
      Explore public data shared with Dat.
    </p>

    <div class="row">
      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="example">
          <div class="example-header example-header--california">
            <img src="/public/img/example-california.svg" alt="" class="example-img">
          </div>
          <div class="example-body">
            <p class="mb0 f7 ttu color-neutral-70">
              California Civic Data
            </p>
            <h4>California Campaign Finance Data</h4>
            <p>
              An open-source archive serving up daily downloads from CAL-ACCESS, California’s database tracking money in state politics.
            </p>
          </div>
          <div class="example-footer">
            <a href="/dat/79cf7ecc9baf627642099542b3714bbef51810da9f541eabb761029969d0161b" class="fr btn btn--green open-desktop">
              Preview
            </a>
            <a href="/download/79cf7ecc9baf627642099542b3714bbef51810da9f541eabb761029969d0161b" class="copy-link">
              <svg><use xlink:href="#daticon-link" /></svg>
              Download
            </a>
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="example">
          <div class="example-header example-header--eop">
            <img src="/public/img/eop.png" alt="Logo EOP" class="example-img">
          </div>
          <div class="example-body">
            <p class="mb0 f7 ttu color-neutral-70">
              Executive Office of The President
            </p>
            <h4>
              Archive of open.whitehouse.gov
            </h4>
            <p>
            Backup of the open data released by President Barack Obama before being deleted in February, 2017.
            </p>
          </div>
          <div class="example-footer">
            <a href="/dat/6fa91405f280c30cedd461dfcd3b4fffffb27759e26f8135b7cbdfe08870ccb2" class="fr btn btn--green open-desktop">
              Preview
            </a>
            <a href="/download/6fa91405f280c30cedd461dfcd3b4fffffb27759e26f8135b7cbdfe08870ccb2" class="copy-link">
              <svg><use xlink:href="#daticon-link"/></svg>
              Download
            </a>
          </div>
        </div>
      </div>

      <div class="col-xs-12 col-sm-6 col-md-4">
        <div class="example">
          <div class="example-header example-header--densho">
            <img src="/public/img/example-densho.png" alt="" class="example-img">
          </div>
          <div class="example-body">
            <p class="mb0 f7 ttu color-neutral-70">
              Densho Digital Repository
            </p>
            <h4>Densho Names Registry</h4>
            <p>
              Names and other information about the individuals held in the ten WRA camps during the WWII incarceration.
            </p>
          </div>
          <div class="example-footer">
            <a href="/dat/f34f99538702f3b55ea3b88c9e374fb72db0ca35903c2249aaa09280accc2062" class="fr btn btn--green open-desktop">
              Preview
            </a>
            <a href="/download/f34f99538702f3b55ea3b88c9e374fb72db0ca35903c2249aaa09280accc2062" class="copy-link">
              <svg><use xlink:href="#daticon-link"/></svg>
              Download
            </a>
          </div>
        </div>
      </div>
    </div>

  </div>
</section>

<section class="section bg-neutral color-white">
  <div class="container">
    <h2 class="content-title">Built With Care</h2>
    <p class="content-subtitle horizontal-rule">
      Dat is built within a vibrant open source module-based ecosystem. <a href="http://awesome.datproject.org/" class="color-blue-disabled hover-color-pink">Learn more.</a>
    </p>
    <div class="row pv4">
      <div class="col-xs-12 col-sm-4">
        <h3 class="content-card-title">Distributed Sync</h3>
        <p class="content-card-subtitle">
          Dat syncs and streams data directly between devices, putting you in control of where your data goes.
        </p>
      </div>
      <div class="col-xs-12 col-sm-4">
        <h3 class="content-card-title">Efficient Storage</h3>
        <p class="content-card-subtitle">
          Data is deduplicated between versions, reducing bandwidth costs and improving speed.
        </p>
      </div>
      <div class="col-xs-12 col-sm-4">
        <h3 class="content-card-title">Data Preservation</h3>
        <p class="content-card-subtitle">
          Dat uses Secure Registers with state of the art cryptography to ensure data is trusted, archived, and preserved.
        </p>
      </div>
    </div>
    <p class="pt4">
      <a href="http://docs.datproject.org" class="btn btn--green">Read the Full Documentation</a>
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="content-title">Sponsors and Supporters</h2>
    <p class="content-subtitle horizontal-rule">Dat is developed by the non-for-profit group Code for Science &amp; Society and supported by generous sponsors.</p>

    <div class="sponsor-logos">
      <a href="https://codeforscience.org/">
        <img src="/public/img/codeforscience.png" class="code-for-science-logo">
      </a>
      <a href="https://sloan.org/programs/digital-technology/data-and-computational-research">
        <img src="/public/img/sloan.png">
      </a>
      <a href="http://www.knightfoundation.org/grants/201346305/">
        <img src="/public/img/knight.png">
      </a>
    </div>
  </div>
</section>
      ${footer(state, prev, send)}
    </div>
  `
}
