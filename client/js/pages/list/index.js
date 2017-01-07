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
              <div class="share-link"><a href="/${dat.username}/${dat.name}">${dat.username}/${dat.name}</a></div>
              <div class="dat-list-item-actions">
                ${copyButton(dat.url, send)}
              </div>
            </div>
            `
        })}
      </div>
    </div>`
}

module.exports = listPage
