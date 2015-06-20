module.exports = RactiveSet

function RactiveSet(ractive, key) {
  this.ractive = ractive
  this.set = {}
  this.key = key
}

RactiveSet.prototype.clear = function () {
  this.set = {}
  this.ractive.set(this.key, [])
}

RactiveSet.prototype._update = function () {
  var self = this
  var keys = Object.keys(self.set)
  var metadats = keys.map(function (key) {
    return self.set[key]
  })
  this.ractive.set(this.key, metadats)
}

RactiveSet.prototype.add = function (item) {
  if (!this.set[item.id]) {
    this.set[item.id] = item
  }
}

RactiveSet.prototype.addItems = function (items, id) {
  for (var idx in items) {
    var item = items[idx]
    this.add(item)
  }
  this._update()
}