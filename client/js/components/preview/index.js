const html = require('choo/html')
const data = require('render-data')
const button = require('../../elements/button')

const preview = (state, prev, send) => {
  const isOpen = state.preview.isPanelOpen ? 'open' : ''
  const fileName = state.preview.fileName
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
          ${fileName}
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
      <div id="render"></div>
    </div>
  </preview>`

  if (fileName) {
    var elem = el.querySelector('#render')
    data.render({
      name: fileName,
      createReadStream: function () {
        return state.preview.readStream
      }}, elem, function (err) {
      if (err) throw err
    })
  }
  return el
}

module.exports = preview
