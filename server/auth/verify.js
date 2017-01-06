// WARNING reads fs on every call

var fs = require('fs')

module.exports = function verifyAccount (user, options, cb) {
  if (typeof options === 'function') {
    cb = options
    options = {}
  }
  var notAllowed = ['users', 'dats']
  if (notAllowed.indexOf(user.username) > -1) return cb(new Error('Username not allowed'))

  if (!options.whitelist) {
    process.nextTick(function () {
      cb(null, 200) // if no whitelist configured, approve all
    })
    return
  }
  fs.readFile(options.whitelist, function (err, buf) {
    if (err) return cb(new Error('error reading invite file'), 400)
    if (buf.length > 1024 * 1024) return cb(new Error('tweet @dat_project and tell them to get a database'), 400)
    var emails = buf.toString().split('\n').filter(function (l) {
      l = l.trim()
      if (!l || l[0] === '#') return false
      return true
    })
    if (emails.indexOf(user.email) === -1) return cb(new Error('email not in invite list'), 401)
    return cb(null, 200)
  })
}
