const pump = require('pump')
const TimeoutStream = require('through-timeout')

module.exports = function (dat, ontimeout) {
  var listStream = dat.archive.list({live: false})
  var timeout = TimeoutStream({
    objectMode: true,
    duration: 5000
  }, () => {
    var msg = 'Looking for sources …'
    return ontimeout(new Error(msg))
  })

  return pump(listStream, timeout, function (err) {
    if (err) ontimeout(err)
  })
}
