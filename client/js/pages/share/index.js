const html = require('choo/html')
const header = require('./../../components/header')

module.exports = function (opts) {
  return (state, prev, send) => {
    if (!module.parent && opts && opts.new) send('archive:new')
    return html`
      <div>
        ${header(state, prev, send)}
        <div class="landing-main container">
          <h3>Create New Dat</h3>
          <p>i've got some instructions for you</p>
        </div>
      </div>`
  }
}
