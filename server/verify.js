// WARNING assumes our whitelist is cloned to ../invited-users relative to this repositories root
// WARNING reads fs on every call

var fs = require('fs')
var path = require('path')
var whitelistPath = path.join(__dirname, '..', '..', 'invited-users', 'README')

module.exports = function verifyAccount (email, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  var whitelist = whitelistPath
  if (options.whitelist) whitelist = options.whitelist
  fs.readFile(whitelist, function (err, buf) {
    if (err) return cb(new Error('error reading invite file'), 400)
    if (buf.length > 1024 * 1024) return cb(new Error('tweet @dat_project and tell them to get a database'), 400)
    var emails = buf.toString().split('\n').filter(function (l) {
      l = l.trim()
      if (!l || l[0] === '#') return false
      return true
    })
    if (emails.indexOf(email) === -1) return cb(new Error('email not in invite list'), 401)
    return cb(null, 200)
  })
}
