var xhr = require('xhr')
var debug = require('debug')('request')

module.exports = function (options, callback) {
  debug('requesting', options)
  xhr(options, function (err, resp, json) {
    var error;
    if (err) {
      error = "Could not connect."
    }

    if (json && json.status == 'error') {
      error = json.message
    }

    if (error) {
      console.error(error)
      window.ractive.set('message', {
        type: 'error',
        text: error
      })
      return callback(err)
    }
    else {
      debug('response', err, resp, json)
      return callback(err, resp, json)
    }
  })
}
