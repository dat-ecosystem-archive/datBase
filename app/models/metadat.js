var path = require('path')
var request = require('../common/error-request.js')

module.exports = Metadat

function Metadat(url) {
  this.url = url.replace(/\/$/, '')
};

Metadat.prototype.constructUrl = function (urlPath) {
  var apiUrl = this.url + urlPath
  console.log('constructing', apiUrl)
  return apiUrl
}

Metadat.prototype.api = function(cb) {
  var self = this
  var apiUrl = self.constructUrl('/api')
  var options = {
    uri: apiUrl,
    method: 'GET',
    json: true,
    timeout: 8000 // 8 seconds
  }
  request(options, cb)
}

Metadat.prototype.apiSession = function (user, pass, cb) {
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
      if (err) return cb(err)
      if (json.loggedOut) {
        return cb(new Error('Bad username or password.'))
      }
      return cb(null, resp, json)
    }
  )
}

Metadat.create = function (metadat, cb) {
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

Metadat.all = function (cb) {
  var options = {
    uri: '/api/metadat',
    method: 'GET',
    json: true
  }
  request(options, function (err, resp, json) {
    if (err) return cb(err)
    return cb(null, resp, json)
  })
}

Metadat.get = function (metadatId, cb) {
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
