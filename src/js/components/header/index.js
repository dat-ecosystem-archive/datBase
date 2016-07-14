var yo = require('yo-yo')
var header = require('dat-header')

module.exports = Header

function Header (el, props) {
  if (!(this instanceof Header)) return new Header(el, props)
  this.$el = document.getElementById(el)
  this.props = props
  this._component = this._render()
  if (this.$el) this.$el.appendChild(this._component)
}

Header.prototype.update = function (state) {
  yo.update(this._component, this._render())
}

Header.prototype._render = function () {
  var self = this
  var props = self.props
  return yo`${header(props)}`
}
