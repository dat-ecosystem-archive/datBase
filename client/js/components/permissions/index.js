var yo = require('yo-yo')
module.exports = Permissions

function Permissions (el) {
  if (!(this instanceof Permissions)) return new Permissions(el)
  this.$el = document.getElementById(el)
  this._component = this._render()
  this._archive = null

  if (this.$el) this.$el.appendChild(this._component)
}

Permissions.prototype.update = function (state) {
  if (state && state.archiveReducer) {
    this._archive = state.archiveReducer.archive
    yo.update(this._component, this._render())
  }
}

Permissions.prototype._render = function () {
  var owner = this._archive ? this._archive.owner : false
  var component = yo`<div>${owner
            ? 'Read & Write'
            : 'Read only'}</div>`
  return component
}
