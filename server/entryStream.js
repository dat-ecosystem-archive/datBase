const pump = require('pump')
const collect = require('collect-stream')
const TimeoutStream = require('through-timeout')

module.exports = function (dat, cb) {
  var TIMEOUT = 5000
  var listStream = dat.archive.list({live: false})
  var cancelled = false

  var timeout = TimeoutStream({
    objectMode: true,
    duration: TIMEOUT
  }, () => {
    cancelled = true
    var msg = 'timed out'
    return cb(new Error(msg))
  })

  var entryStream = pump(listStream, timeout, function (err) {
    if (cancelled) return
    if (err) cb(err)
  })

  setTimeout(function () {
    if (cancelled) return
    cancelled = true
    var msg = 'Metadata is too large'
    return cb(new Error(msg))
  }, TIMEOUT)

  collect(entryStream, function (err, entries) {
    if (cancelled) return
    cancelled = true
    if (err) return cb(err)
    cb(null, entries)
  })
}
