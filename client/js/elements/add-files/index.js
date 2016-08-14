const html = require('choo/html')

module.exports = function (props) {
  return html`<label style="position: relative">
    <div class="button-add">Add Files</div>
    <input multiple style="display: none" type="file" class="dat-button" onchange=${props.onfiles} />
  </label>`
}
