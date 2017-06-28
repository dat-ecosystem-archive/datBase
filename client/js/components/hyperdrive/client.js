var yofs = require('yo-fs')

module.exports = function ui (root, entries, onclick) {
  var tree = yofs(root, entries, onclick)
  return tree.widget
}
