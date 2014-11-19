var path = require('path')
var request = require('browser-request')

module.exports = Dat

function Dat(url) {
  this.url = url
};

Dat.prototype.constructUrl = function (urlPath) {
  var apiUrl = path.join(this.url, urlPath)
  console.log('constructing', apiUrl)
  return apiUrl
}

Dat.prototype.api = function(cb) {
  var self = this
  var apiUrl = self.constructUrl('/api')
  var options = {
    uri: apiUrl,
    method: 'GET',
    json: true,
    timeout: 10000 // 10 seconds
  }
  request(options, cb)
}

Dat.prototype.apiSession = function (user, pass, cb) {
  var self = this
  var apiUrl = self.constructUrl('/api/session')
  var options = {
    uri: apiUrl,
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

Dat.get = function (metadatId, cb) {
  var self = this
  var options = {
    uri: '/api/metadat/' + metadatId,
    method: 'GET',
    json: true
  }
  request(options, function (err, resp, json) {
    if (err) {
      return cb(new Error('Could not get that dat, are you sure the ID is right?'))
    }
    return cb(null, resp, json)
  })
}

Dat.prototype.save = function (metadat, cb) {
  var self = this
  var options = {
    uri: '/api/metadat',
    method: 'POST',
    json: metadat
  }
  request(options, function (err, resp, json) {
    if (err) return cb(err)
    return cb(null, resp, json)
  })
}
