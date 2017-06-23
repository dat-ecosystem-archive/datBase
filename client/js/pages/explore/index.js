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
