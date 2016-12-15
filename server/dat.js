const Dat = require('./haus')
const datKey = require('dat-key-as')
const collect = require('collect-stream')
const TimeoutStream = require('through-timeout')

module.exports = function (key, cb) {
  var decoded
  try {
    decoded = datKey.buf(key)
  } catch (err) {
    return cb(err)
  }
  var dat = Dat(decoded)
  var listStream = dat.archive.list({live: false})
  var cancelled = false
  var timeout = TimeoutStream({
    objectMode: true,
    duration: 3000
  }, () => {
    cancelled = true
    var msg = 'Looking for sources...'
    return cb(new Error(msg), dat)
  })

  collect(listStream.pipe(timeout), function (err, entries) {
    if (cancelled) return
    return cb(err, dat, entries)
  })
}
