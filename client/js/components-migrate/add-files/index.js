var yo = require('yo-yo')

module.exports = function AddFiles (props) {
  this.props = props

  return yo`<label><div id="js-button-add" class="button-add">Add Files</div><input multiple style="display: none" type="file" class="dat-button" onchange=${this.props.onfiles} /></label>`
}
