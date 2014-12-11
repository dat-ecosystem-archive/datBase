var xhr = require('xhr')
var debug = require('debug')('request')

module.exports = function (options, callback) {
  debug('requesting', options)
  xhr(options, function (err, resp, json) {
    if (err) {
      console.error(err)
      return callback(err)
    }
    if (json && json.status == 'error') {
      console.error(json.message)
      window.ractive.message('error', json.message)
      return callback(err)
    }
    else {
      debug('response', err, resp, json)
      return callback(err, resp, json)
    }
  })
}
