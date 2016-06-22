var yo = require('yo-yo')
var speedometer = require('speedometer')
var prettyBytes = require('pretty-bytes')

module.exports = SpeedDisplay

function SpeedDisplay (el, store) {
  if (!(this instanceof SpeedDisplay)) return new SpeedDisplay(el)
  this.$el = document.getElementById(el)
  this._archiveKey
  this._timer
  this._uploadSpeedometer = speedometer(3)
  this._downloadSpeedometer = speedometer(3)
  this._upload
  this._download
  this._component = this._render()

  if (this.$el) this.$el.appendChild(this._component)
}

SpeedDisplay.prototype.update = function (state) {
  if (state && state.archiveReducer) {
    this._attachHandlers(state)
  }
}

SpeedDisplay.prototype._render = function () {
  var self = this
  window.clearTimeout(this._timer)
  this._timer = window.setTimeout(function () {
    self.$el.style.display = 'none'
    self._download = 0
    self._upload = 0
  }, 1500)

  var down = this._download
  var up = this._upload
  var component = yo`<span>speed:
                     <span id="download-speed">download: ${down}</span>
                     <span id="upload-speed">upload: ${up}</span>
                     </span>`

  if (down || up) this.$el.style.display = 'block'
  return component
}

SpeedDisplay.prototype._attachHandlers = function (state) {
  var self = this
  if (state && state.archiveReducer) {
    var s = state.archiveReducer
    if (s.archive && s.archive.key.toString('hex') !== this._archiveKey) {
      this._archiveKey = s.archive.key.toString('hex')

      s.archive.on('upload', function (data) {
        self._calculate('upload', data)
      })
      s.archive.on('download', function (data) {
        self._calculate('download', data)
      })
    }
  }
}

SpeedDisplay.prototype._calculate = function (direction, data) {
  if (!data.length) return
  var speedometerPropName = '_' + direction + 'Speedometer'
  var bytesPerSecond = this[speedometerPropName](data.length)
  if (bytesPerSecond) {
    var propName = '_' + direction
    this[propName] = prettyBytes(bytesPerSecond)
    yo.update(this._component, this._render())
  }
}
