var path = require('path')
var yofs = require('yo-fs')

module.exports = function ui (root, entries, onclick) {
  var lookup = {}
  for (var i in entries) {
    var entry = entries[i]
    lookup[entry.name] = entry
    var dir = path.dirname(entry.name)
    if (!lookup[dir]) {
      lookup[dir] = {
        type: 'directory',
        name: dir,
        length: 0
      }
    }
  }
  var vals = Object.keys(lookup).map(key => lookup[key])
  var tree = yofs(root, vals, onclick)
  return tree.widget
}
