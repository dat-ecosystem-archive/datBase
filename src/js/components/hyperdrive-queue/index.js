var yo = require('yo-yo')

module.exports = HyperdriveQueue

function HyperdriveQueue (el) {
  if (!(this instanceof HyperdriveQueue)) return new HyperdriveQueue(el)
  this.$el = document.getElementById(el)
  this._component = this._render()
  this.files = []

  if (this.$el) this.$el.appendChild(this._component)
}

HyperdriveQueue.prototype.update = function (state) {
  if (state && state.hyperdriveQueueReducer) {
    // do some shit
  }
}

HyperdriveQueue.prototype._render = function () {
  var component = yo`<ul><li>i am the hyperdrive queue</li></ul>`
  return component
}
