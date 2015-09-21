var request = require('request').defaults({json: true})
var series = require('run-series')
var extend = require('extend')
var spawn = require('tape-spawn')
var tmp = require('os').tmpdir()
var path = require('path')
var rimraf = require('rimraf')
var crypto = require('crypto')
var debug = require('debug')('test-metadat')

var TEST_TRACKER = {
  'id': 'http://dat-manager.org',
  'name': 'Dat manager',
  'description': 'Some place where we store a bunch of dats',
  'contact': 'karissa'
}

var status

module.exports.create = function(test, common) {
  test('adding a dat tracker success', function (t) {
    var data = extend({}, TEST_TRACKER)
    common.testPOST(t, '/api/tracker', data, function (err, api, jar, res, json, done) {
      t.ifError(err)
      t.equal(res.statusCode, 201, 'returns 201')

      request({
        method: 'GET',
        jar: jar,
        uri: 'http://localhost:' + api.options.PORT + '/api/tracker/',
        qs: {
          id: TEST_TRACKER.id,
        }
      }, function (err, res, json) {
        t.ifError(err)
        t.equal(res.statusCode, 200)
        t.equal(json.data.length, 1)
        done()
      })
    })
  })
}


module.exports.all = function(test, common) {
  module.exports.create(test, common)
  //module.exports.delete(test, common)
  //module.exports.update(test, common)
}
