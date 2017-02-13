const collect = require('collect-stream')

module.exports = function (archive, cb) {
  var TIMEOUT = 5000
  var stream = archive.list({live: false, limit: 1000})
  var cancelled = false

  var timeout = setTimeout(function () {
    var msg = 'timed out'
    cancelled = true
    return cb(new Error(msg))
  }, TIMEOUT)

  collect(stream, function (err, entries) {
    clearTimeout(timeout)
    if (cancelled) return
    if (err) return cb(err)
    cb(null, entries)
  })
}
