var request = require('../common/error-request.js')

/** TODO: can we replace this by using the dat JS api? **/

function constructUrl (url, path) {
  var apiUrl = url.replace(/\/$/, '') + path
  console.log('constructing', apiUrl)
  return apiUrl
}

module.exports.api = function(url, cb) {
  var self = this
  var apiUrl = constructUrl(url, '/api')
  var options = {
    uri: apiUrl,
    method: 'GET',
    json: true,
    timeout: 8000 // 8 seconds
  }
  request(options, cb)
}

module.exports.apiSession = function (url, user, pass, cb) {
  var self = this
  var apiUrl = constructUrl(url, '/api/session')
  var options = {
    uri: apiUrl,
    method: 'GET',
    json: true,
    headers: {'authorization': 'Basic ' + btoa(user + ':' + pass)}
  }
  request(options,
    function (err, resp, json) {
      if (err) return cb(err)
      if (json.loggedOut) {
        return cb(new Error('Bad username or password.'))
      }
      return cb(null, resp, json)
    }
  )
}