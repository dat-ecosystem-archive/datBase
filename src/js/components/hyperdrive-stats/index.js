var yo = require('yo-yo')
var encoding = require('dat-encoding')
var prettyBytes = require('pretty-bytes')

module.exports = Stats

function Stats (el, store) {
  if (!(this instanceof Stats)) return new Stats(el)
  this.$el = document.getElementById(el)
  this._archiveKey
  this._upload = 0
  this._download = 0
  this._component = this._render()

  if (this.$el) this.$el.appendChild(this._component)
}

Stats.prototype.update = function (state) {
  if (state && state.archiveReducer) {
    this._attachHandlers(state)
  }
}

Stats.prototype._render = function () {
  var down = prettyBytes(this._download)
  var up = prettyBytes(this._upload)
  var component = yo`<span><span>Total Download: ${down}</span><span>Total Upload: ${up}</span></span>`
  if (this._download || this._upload) this.$el.style.display = 'block'

  return component
}

Stats.prototype._attachHandlers = function (state) {
  var self = this
  if (state && state.archiveReducer) {
    var s = state.archiveReducer
    if (!s.archive) return
    var key = encoding.encode(s.archive.key)
    if (key !== this._archiveKey) {
      this._archiveKey = key

      s.archive.on('upload', function (data) {
        self._upload += data.length
        yo.update(self._component, self._render())
      })
      s.archive.on('download', function (data) {
        self._download += data.length
        yo.update(self._component, self._render())
      })
    }
  }
}
