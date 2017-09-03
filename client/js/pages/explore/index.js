const html = require('choo/html')
const list = require('./../../components/list')
const header = require('./../../components/header')

const listPage = (state, emit) => {
  console.log('list page got', state.explore.data)
  var dats = state.explore.data.map(function (dat) {
    dat.shortname = `${dat.username}/${dat.name}`
    return dat
  })
  return html`
  <div>
    ${header(state, emit)}
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

    <section class="section">
      <div class="container">
        ${list(dats, emit)}
      </div>
    </section>
  </div>`
}

module.exports = listPage
