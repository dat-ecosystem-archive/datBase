const html = require('choo/html')
const list = require('./../../components/list')
const header = require('./../../components/header')

const listPage = (state, prev, send) => {
  state.list.data.map(function (dat) {
    dat.shortname = `${dat.username}/${dat.name}`
    return dat
  })
  return html`
  <div>
    ${header(state, prev, send)}
    <div class="container">
    ${list(state.list.data, send)}
    </div>
  </div>`
}

module.exports = listPage
