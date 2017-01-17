const pump = require('pump')
const TimeoutStream = require('through-timeout')

module.exports = function (dat, ontimeout) {
  var listStream = dat.archive.list({live: false})
  var timeout = TimeoutStream({
    objectMode: true,
    duration: 3000
  }, () => {
    var msg = 'Looking for sources …'
    return ontimeout(new Error(msg))
  })

  return pump(listStream, timeout)
}
