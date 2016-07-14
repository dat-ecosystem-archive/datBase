var yo = require('yo-yo')
var prettyBytes = require('pretty-bytes')

module.exports = HyperdriveSize

function HyperdriveSize (el) {
  if (!(this instanceof HyperdriveSize)) return new HyperdriveSize(el)
  this.$el = document.getElementById(el)
  this._component = this._render()
  this._size = 0

  if (this.$el) this.$el.appendChild(this._component)
}

HyperdriveSize.prototype.update = function (state) {
  if (state && state.archiveReducer) {
    this._updateSize(state)
    yo.update(this._component, this._render())
  }
}

HyperdriveSize.prototype._render = function () {
  var size = this._size
  var component = yo`<p id="size">Drive size: ${size}</p>`
  return component
}

HyperdriveSize.prototype._updateSize = function (state) {
  if (state.archiveReducer) {
    var s = state.archiveReducer
    if (s.archive && s.archive.content && s.archive.content.bytes) {
      this._size = prettyBytes(s.archive.content.bytes)
    } else {
      this._size = '0 MB'
    }
    return this._size
  }
}
