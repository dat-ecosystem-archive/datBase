const html = require('choo/html')
const header = require('./../../components/header')

const createPage = (state, prev, send) => {
  return html`
    <div>
    ${header(state, prev, send)}

    <section class="section bg-splash-02" id="publish">
      <div class="container">
        <div class="row">
        <h3>Create a Dat</h3>
        <p></p>
        </div>
      </section>
    </div>`
}

module.exports = createPage
