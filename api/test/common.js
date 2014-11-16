var path = require('path')
var debug = require('debug')('test-common')
var st = require("st")
var request = require('request').defaults({json: true})
var rimraf = require('rimraf')

var Server = require('../../api')
var defaults = require('../../api/defaults.js')

module.exports = function() {
  var common = {}
  common.testPrefix = ''


  common.testGET = function (t, path, data, cb) {
    this.getRegistry(t, function(err, api, done) {
      params = {
        method: 'GET',
        uri: 'http://localhost:' + api.options.PORT + path
      }
      debug('requesting', params)
      request(params, function get(err, res, json) {
        cb(err, api, res, json, done)
      })
    })
  }

  common.testPOST = function (t, path, data, cb) {
    this.getRegistry(t, function(err, api, done) {
      params = {
        method: 'POST',
        uri: 'http://localhost:' + api.options.PORT + path,
        json: data,
        'content-type': 'application/json'
      }
      debug('requesting', params)
      request(params, function get(err, res, json) {
        cb(err, api, res, json, done)
      })
    })
  }

  common.getRegistry = function (t, cb) {

    var api = Server(defaults)
    var port = api.options.PORT

    api.server.listen(port, function() {
      console.log('listening on port', port)
      cb(null, api, done)
    })

    function done() {
      setTimeout(destroy, 200) // fixes weird test errors on travis-ci

      function destroy() {
        rimraf(defaults.DAT_REGISTRY_DB, function () {
          api.server.close()
          api.models.db.close()
          api.session.close()
          t.end()
        });
      }

    }

  }

  return common
}

