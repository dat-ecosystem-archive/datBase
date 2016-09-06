const html = require('choo/html')

module.exports = function (props) {
  const onfiles = (e) => props.onfiles(e.target.files)
  return html`<label style="position: relative">
    <div id="js-button-add" class="button-add">Add Files</div>
    <input multiple style="display: none" type="file" class="dat-button" onchange=${onfiles} />
  </label>`
}
