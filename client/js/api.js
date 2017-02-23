var api = require('dat-registry')

module.exports = function () {
  if (!module.parent) {
    return api({server: window.location.origin})
  }
  return
}
