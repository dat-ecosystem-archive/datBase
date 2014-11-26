var xhr = require('xhr')

module.exports = function (options, callback) {
  xhr(options, function (err, resp, json) {
    var error;
    if (json.status == 'error') {
      error = json.message
    }

    if (error) {
      console.error(error)
      window.ractive.set('message', {
        type: 'error',
        text: error
      })
    }
    else {
      return callback(err, resp, json)
    }
  })
}
