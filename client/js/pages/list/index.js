const html = require('choo/html')
const header = require('./../../components/header')
const copyButton = require('./../../components/copy-button')

const listPage = (state, prev, send) => {
  var dats = state.list.data || []
  return html`
    <div>
    ${header(state, prev, send)}
      <div class="dat-list">
        ${dats.map(function (dat) {
          return html`
            <div class="dat-list-item">
              <h3>${dat.name}</h3>
              <div class="dat-list-item-actions">
              ${copyButton(dat, send)}
            </div>
            `
        })}
      </div>
    </div>`
}

module.exports = listPage
