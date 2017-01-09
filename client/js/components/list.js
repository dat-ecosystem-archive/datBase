const html = require('choo/html')

module.exports = (state, prev, send) => {
  var dats = state.list.data || []
  return html`
  <div class="dat-list">
  ${dats.map(function (dat) {
    return html`
    <div class="dat-list-item">
    <div class="share-link"><a href="/${dat.username}/${dat.name}">${dat.username}/${dat.name}</a></div>
    </div>
    `
  })}
  </div>`
}
