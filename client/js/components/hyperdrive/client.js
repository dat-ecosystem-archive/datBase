var path = require('path')
var yofs = require('yo-fs')

module.exports = function ui (root, entries, onclick) {
  var lookup = {}
  var updated = null // last modified date
  for (var i in entries) {
    if (!updated) updated = new Date(entry.mtime)
    else {
      var compare = new Date(entry.mtime)
      if (updated.getTime() > compare.getTime()) updated = compare
    }
    var entry = entries[i]
    if (entry.name[0] === '/') entry.name = entry.name.substring(1, entry.name.length)
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
  console.log(updated)
  var vals = Object.keys(lookup).map(key => lookup[key])
  var tree = yofs(root, vals, onclick)
  return tree.widget
}
