var yo = require('yo-yo')

module.exports = function AddFiles (props) {
  this.props = props

  return yo`<label><div style="display: inline; padding: 0.2em; color: white; text-transform: uppercase; background-color: #2980b9">Add Files</div><input multiple style="display: none" type="file" class="dat-button" onchange=${this.props.onfiles} /></label>`
}
