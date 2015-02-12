var request = require('request').defaults({json: true})
var debug = require('debug')('test-search')
var qs = require('querystring')
var extend = require('extend')
var series = require('run-series')

var TEST_DAT = {
  'owner_id': 'karissa',
  'name': 'test entry',
  'description': 'i am a description. this is a very long discription with a '+
                'lot of different characters and things you might be interested in searching for. how fun',
  'url': 'http://dat-data.dathub.org',
  'datasets': [
    {name:'organizations'},
    {name:'demographic_model_output'},
    {name:'organizer_models'}
  ],
  'readme': '',
  'json': {
    'name': 'some-name',
    'version': 1.3
  },
  'license': 'BSD-2',
}

module.exports.searchMetadatDescription = function (test, common) {
  test('should be able to search for a metadats description', function(t) {
    var data = extend({}, TEST_DAT) // clone

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'create returns 201')
        t.equal(typeof json.id, 'string', 'create return id is a string')
        t.equal(json.name, data.name, 'create returns corrent name')
        request({
          method: 'GET',
          uri: 'http://localhost:' + api.options.PORT + '/search/description',
          qs: {
            query: 'characters'
          }
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(res.statusCode, 200, 'search returns 200')
          debug('search results', json)
          t.ok(json.rows && json.rows.length === 1, 'search returns one item')
          done()
        })
      }
    )
  })
}

module.exports.searchMetadatDescriptionAfterChange = function (test, common) {
  test('should be able to search for a metadats description', function(t) {
    var data = extend({}, TEST_DAT) // clone
    data.name = 'a different dat! '

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'create returns 201')
        t.equal(typeof json.id, 'string', 'create return id is a string')
        t.equal(json.name, data.name, 'create returns corrent name')

        var fns = [
          function (next) {
            request({
              method: 'GET',
              uri: 'http://localhost:' + api.options.PORT + '/search/description',
              qs: {
                query: 'characters'
              }
            }, function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 200, 'search returns 200')
              debug('search results', json)
              t.ok(json.rows && json.rows.length === 1, 'search returns one item')
              next()
            })
          },
          function (next) {
            data.description = 'description changed'
            request({
              method: 'PUT',
              jar: jar,
              uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
              json: data,
            }, function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 200, 'update returns 200')
              t.equal(json.description, data.description)
              next()
            })
          },
          function (next) {
            request({
              method: 'GET',
              uri: 'http://localhost:' + api.options.PORT + '/search/description',
              qs: {
                query: 'description changed'
              }
            }, function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 200, 'search returns 200')
              debug('search results', json)
              t.ok(json.rows && json.rows.length === 1, 'search description')
              next()
            })
          },
          function (next) {
            request({
              method: 'GET',
              uri: 'http://localhost:' + api.options.PORT + '/search/name',
              qs: {
                query: 'a different dat!'
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
  module.exports.searchMetadatDescription(test, common);
  module.exports.searchMetadatDescriptionAfterChange(test, common);
}