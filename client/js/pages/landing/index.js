const html = require('choo/html')
const header = require('../../components/header')
const footer = require('../../elements/footer')

module.exports = function (state, emit) {
  return html`
    <div>
      ${header(state, emit)}
      <section>
        helloooo world
      </section>
      ${footer(state, emit)}
    </div>
  `
}
