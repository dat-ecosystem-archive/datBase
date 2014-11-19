var path = require('path')
var request = require('browser-request')

module.exports = Dat

function Dat(url) {
  this.url = url
};

Dat.prototype.save = function (metadata) {
  var self = this
  var apiUrl = self.constructUrl
  $.post(apiUrl, data, function (data) {

  })
}

Dat.prototype.constructUrl = function (urlPath) {
  var apiUrl = path.join(this.url, urlPath)
  console.log('constructing', apiUrl)
  return apiUrl
}

Dat.prototype.api = function(cb) {
  var self = this
  var apiUrl = self.constructUrl('/api')
  var options = {
    url: apiUrl,
    method: 'GET',
    json: true
  }
  request(options, cb)
}

Dat.prototype.apiSession = function (user, pass, cb) {
  var self = this

  var apiUrl = self.constructUrl('/api/session')

  function setHeader(xhr) {
    xhr.setRequestHeader();
  }

  var options = {
    url: apiUrl,
    method: 'GET',
    json: true,
    headers: {'authorization': 'Basic ' + btoa(user + ':' + pass)}
  }
  request(options,
    function (err, resp, json) {
      if (err) {
        return cb(new Error('Something went wrong.'))
      }
      if (json.loggedOut) {
        return cb(new Error('Bad username or password.'))
      }
      return cb(null, resp, json)
    }
  )
}
