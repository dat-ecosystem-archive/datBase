const html = require('choo/html')
const since = require('relative-date')

module.exports = (state, prev, send) => {
  var dats = state.list.data || []
  return html`
  <div class="dat-list">
  ${dats.map(function (dat) {
    return html`
    <div class="dat-list-item">
    <div class="share-link"><a href="/${dat.username}/${dat.name}">${dat.username}/${dat.name}</a></div>
      <p>${dat.title}</p>
      <div class="dat-detail">
        <p>Published ${since(dat.created_at)}</p>
      </div>
    </div>
    `
  })}
  </div>`
}
