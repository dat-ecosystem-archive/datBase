const html = require('choo/html')
const button = require('../../elements/button')

// XXX: server-side data rendering could pull from a cache if we want
const data = module.parent ? function () { } : require('render-data')

const preview = (state, prev, send) => {
  const isOpen = state.preview.isPanelOpen ? 'open' : ''
  const entryName = state.preview.entryName
  const readStream = state.preview.readStream

  var el = html`<section id="preview" class="panel ${isOpen}">
    <div class="panel-header">
      ${button({
        klass: 'btn--green panel-header__close-button',
        text: 'Close',
        click: () => {
          send('preview:closePanel')
        }
      })}
      <div class="panel-header__title-group">
        <div class="panel-title">
          ${entryName}
        </div>
        <div class="dat-details">
          <div class="dat-detail">XX.X KB</div>
          <div class="dat-detail">some other metadata</div>
        </div>
      </div>
      <div class="panel-header__action-group">
        <button class="dat-header-action">Download</button>
        <button class="dat-header-action">Open in Desktop App</button>
      </div>
    </div>
    <div class="panel-main">
      <div id="display"></div>
    </div>
  </section>`

  if (readStream) {
    var elem = el.querySelector('#display')
    data.render({
      name: entryName,
      createReadStream: function () { return readStream }
    }, elem, function (err) {
      if (err) throw err
    })
  }
  return el
}

module.exports = preview
