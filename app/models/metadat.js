var path = require('path')
var request = require('../common/error-request.js')

module.exports = Metadat

function Metadat(metadat) {
  if (metadat.name) {
    metadat.name = metadat.name.trim()
  }
  if (metadat.description) {
    metadat.description = metadat.description.trim()
  }
  this.data = metadat
}

Metadat.prototype.create = function (cb) {
  var self = this
  var options = {
    uri: '/api/metadat',
    method: 'POST',
    json: this.data
  }
  request(options, function (err, resp, json) {
    if (err) return cb(err)
    self.data.id = json.id
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
