var html = require('choo/html')
const header = require('../../components/header')
var footer = require('./footer')

module.exports = function (state, emit) {
  return html`
    <div>
      ${header(state, emit)}
      <section class="section bg-splash">
  <div class="container">
    <h1 class="mt0 tc normal f2 f1-ns ">
      Powerful data sharing
      <br>
      from your desktop.
    </h1>
    <p class="tc mb4 color-neutral-50">
      Dat is the distributed data sharing tool. Use the desktop app, command line tool, and javascript library.
    </p>
    <div class="splash-visual">
      <img src="/public/img/screenshot-dat-desktop.png" />
    </div>
    <p class="tc pv3 color-white">
      <a href="http://datproject.github.io/dat-desktop/mac" class="btn btn--green btn--full btn--cta open-desktop mt2" target="_blank">
        <svg><use xlink:href="#daticon-open-in-desktop"/></svg>
        Download for Mac
      </a>
      <a href="http://datproject.github.io/dat-desktop/linux" class="btn btn--green btn--cta open-desktop mt2" target="_blank">
        <svg><use xlink:href="#daticon-open-in-desktop"/></svg>
        Download for Linux
      </a>
    </p>
    <p class="f7 tc color-neutral-50">
      Windows coming soon.
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-sm-5 col-md-6 flex flex-column justify-center">
        <div class="pa2 bg-neutral screenshot">
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
          <a href="/install" class="btn btn--green btn--full" target="_blank">
            Install Dat CLI
          </a>
        </p>
        <p class="f6">
          <a href="http://docs.datproject.org">
            Read the Docs
          </a>
          <span class="color-pink ph1">|</span>
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
      <a href="/explore" data-no-routing>Explore</a> public data shared with Dat.
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
            <a href="/534fa5db12b8ea8c0d1a51a31702797b37cea60ee4dee10ec35b59bfb284e4d4" class="fr btn btn--green btn--full open-desktop" data-no-routing>
              Preview
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
            <a href="/dfa1660194d17862bb2e017f9926eccc6d73493e3985f25e0b89d06204d30b39" class="fr btn btn--green btn--full open-desktop" data-no-routing>
              Preview
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
            <a href="/9df6c69a6337cb24d6a45f8a71364f8e58fa37608f14ca37fec743a856b3ed97" class="fr btn btn--green btn--full open-desktop" data-no-routing>
              Preview
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
      Dat is built within a vibrant open source module-based ecosystem. <a href="http://datproject.org/paper" class="color-blue-disabled hover-color-pink">Read the paper.</a>
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
      <a href="http://docs.datproject.org" class="btn btn--green btn--full">Read the Full Documentation</a>
    </p>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="content-title">Sponsors and Supporters</h2>
    <p class="content-subtitle horizontal-rule">Dat is developed by the not-for-profit group Code for Science & Society and supported by generous sponsors.</p>

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
      ${footer(state, emit)}
    </div>
  `
}
