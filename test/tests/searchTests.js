var request = require('request').defaults({json: true})
var debug = require('debug')('test-search')
var tmp = require('os').tmpdir()
var path = require('path')
var extend = require('extend')
var series = require('run-series')

var TEST_DAT = {
  'owner_id': 'karissa',
  'description': 'i am a description. this is a very long discription with a ' +
    'lot of different characters and things you might be interested in searching for. how fun',
  'url': path.join(tmp, 'dat-3'),
  'readme': '',
  'license': 'BSD-2'
}

module.exports.createMetadat = function (test, common) {
  common.createDat(test, TEST_DAT)
}

module.exports.searchMetadatDescription = function (test, common) {
  test('should be able to search for a metadats description', function (t) {
    var data = extend({}, TEST_DAT) // clone

    common.getRegistry(t, function (err, api, done) {
      t.ifError(err)
      var fns = [
        function (next) {
          request({
            method: 'GET',
            uri: 'http://localhost:' + api.options.PORT + '/search/',
            qs: {
              query: '*dat*'
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
    })
  })
}

module.exports.all = function (test, common) {
  module.exports.createMetadat(test, common)
//  module.exports.searchMetadatDescription(test, common)
}
