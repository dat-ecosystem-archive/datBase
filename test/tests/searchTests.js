var request = require('request').defaults({json: true})
var debug = require('debug')('test-search')
var qs = require('querystring')
var tmp = require('os').tmpdir()
var extend = require('extend')
var series = require('run-series')

var TEST_DAT = {
  'owner_id': 'karissa',
  'name': 'test entry',
  'description': 'i am a description. this is a very long discription with a '+
                'lot of different characters and things you might be interested in searching for. how fun',
  'url': tmp,
  'readme': '',
  "status": {
    "transaction":false,
    "checkout":false,
    "modified":"2015-06-19T00:05:32.088Z",
    "datasets":2,
    "rows":2,
    "files":0,
    "versions":2,
    "size":224,
    "version":"425a8265bbd4442ec1b8dd7aea712cf579abe5cfb6995b3a34b01cb0e415e23a"
  },
  'license': 'BSD-2',
}

module.exports.createMetadat = function (test, common) {
  test('should be able to create a metadat', function(t) {
    var data = extend({}, TEST_DAT) // clone

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'create returns 201')
        t.equal(typeof json.id, 'string', 'create return id is a string')
        t.equal(json.name, data.url, 'create returns corrent name')
        done()
      }
    )
  })
}

module.exports.searchMetadatDescription = function (test, common) {
  test('should be able to search for a metadats description', function(t) {
    var data = extend({}, TEST_DAT) // clone
    data.name = 'a different dat! '

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'create returns 201')
        t.equal(typeof json.id, 'string', 'create return id is a string')
        t.equal(json.name, data.url, 'create returns correct name')

        var fns = [
          function (next) {
            request({
              method: 'GET',
              uri: 'http://localhost:' + api.options.PORT + '/search/name',
              qs: {
                query: data.url
              }
            }, function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 200, 'search returns 200')
              debug('search results', json)
              t.ok(json.rows && json.rows.length === 1, 'search name')
              next()
            })
          },
          function (next) {
            done()
          }
        ]
        series(fns)
      }
    )
  })
}

module.exports.all = function(test, common) {
  module.exports.createMetadat(test, common);
  module.exports.searchMetadatDescription(test, common);
}
