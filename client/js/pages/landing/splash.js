var html = require('choo/html')
var header = require('./header')
var footer = require('./footer')

module.exports = function (state, prev, send) {
  return html`
    <div>
      ${header(state, prev, send)}
      <section class="section">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-7 col-md-6">
              <h1 class="mt0 f2 f1-ns">
                Powerful dataset sharing.
              </h1>
              <p class="measure mb4">
                Dat is the package manager for datasets.
                Easily share and version control datasets using our powerful command line tool and javascript library. Secure, distributed, fast.
              </p>
              <p>
                <a href="/install" class="btn btn--green btn--cta px4" target="_blank">
                  Install Dat
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
            <div class="col-xs-12 col-sm-5 col-md-6 flex flex-column justify-center">
              <div class="p2 bg-neutral screenshot">
                <img src="/public/img/dat-gif.gif" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-neutral-04">
        <div class="container">

          <h2 class="content-title">Shared with Dat</h2>
          <p class="content-subtitle horizontal-rule">
            Explore public datasets shared with Dat.
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
                  <a href="/view/79cf7ecc9baf627642099542b3714bbef51810da9f541eabb761029969d0161b" class="fr btn btn--green open-desktop">
                    Preview
                  </a>
                  <a href="/download/79cf7ecc9baf627642099542b3714bbef51810da9f541eabb761029969d0161b" class="copy-link">
                    <svg><use xlink:href="#daticon-link"></use></svg>
                    Download
                  </a>
                </div>
              </div>
            </div>

            <div class="col-xs-12 col-sm-6 col-md-4">
              <div class="example">
                <div class="example-header example-header--osm">
                  <img src="/public/img/example-osm.svg" alt="" class="example-img">
                </div>
                <div class="example-body">
                  <p class="mb0 f7 ttu color-neutral-70">
                    NASA
                  </p>
                  <h4>Ice, Cloud, and Land Elevation Satellite</h4>
                  <p>
                    Measuring the Height of Earth from space.
                  </p>
                </div>
                <div class="example-footer">
                  <a href="/view/bf37b184c981c3db293f20530cd6461e39f8147c221b1e3ee03e08ef2b747547" class="fr btn btn--green open-desktop">
                    Preview
                  </a>
                  <a href="/download/bf37b184c981c3db293f20530cd6461e39f8147c221b1e3ee03e08ef2b747547" class="copy-link">
                    <svg><use xlink:href="#daticon-link"></use></svg>
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
                  <a href="/view/f34f99538702f3b55ea3b88c9e374fb72db0ca35903c2249aaa09280accc2062" class="fr btn btn--green open-desktop">
                    Preview
                  </a>
                  <a href="/download/f34f99538702f3b55ea3b88c9e374fb72db0ca35903c2249aaa09280accc2062" class="copy-link">
                    <svg><use xlink:href="#daticon-link"></use></svg>
                    Download
                  </a>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      <section class="section bg-neutral white">
        <div class="container">
          <h2 class="content-title">Built With Care</h2>
          <p class="content-subtitle horizontal-rule">
            Dat is built within a vibrant open source module-based ecosystem. <a href="http://awesome.datproject.org/">Learn more.</a>
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

      <section class="section bg-neutral-04">
        <div class="container">
          <div class="row">
            <div class="col-xs-12 col-sm-6 flex flex-column justify-center">
              <h2 class="content-title">
                Dat Desktop
              </h2>
              <p class="content-subtitle horizontal-rule">
                Coming soon for MacOS.
              </p>
              <p class="measure-narrow">
                Share and manage your data with with ease. The desktop app comes with a clean and simple interface that helps you manage multiple projects on a single machine.
              </p>
              <!-- <a href="https://github.com/datproject/dat-desktop" class="btn btn--green btn--cta open-desktop" target="_blank">
                <svg><use xlink:href="#daticon-open-in-desktop"></use></svg>
                View on GitHub
              </a> -->
              </p>
              <p class="f6">
                <!-- <a href="http://docs.datproject.org">
                  Use the Command Line
                </a>
                <span class="color-pink">&ensp; | &ensp;</span>
              -->
                <a href="http://github.com/datproject/dat-desktop">
                  View &amp; Contribute on Github
                </a>
              </p>
            </div>
            <div class="col-xs-12 col-sm-6 flex flex-column justify-center">
              <img src="/public/img/screenshot-dat-desktop.png" class="screenshot" />
            </div>
          </div>
        </div>
      </section>

      <section class="section bg-white">
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
