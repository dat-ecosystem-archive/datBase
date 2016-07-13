var yo = require('yo-yo')

module.exports = FileQueue

function FileQueue (el) {
  if (!(this instanceof FileQueue)) return new FileQueue(el)
  this.$el = document.getElementById(el)
  this._component = this._render()
  this.files = []

  if (this.$el) this.$el.appendChild(this._component)
}

FileQueue.prototype.update = function (state) {
  if (state && state.fileQueueReducer) {
    // do some shit
  }
}

FileQueue.prototype._render = function () {
  var component = yo`<ul><li>i am the file queue</li></ul>`
  return component
}
