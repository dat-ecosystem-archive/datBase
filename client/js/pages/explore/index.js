const html = require('choo/html')
const list = require('./../../components/list')
const header = require('./../../components/header')

const listPage = (state, prev, send) => {
  return html`
  <div>
    ${header(state, prev, send)}

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
        ${list(state, prev, send)}
      </div>
    </section>
  </div>`
}

module.exports = listPage
