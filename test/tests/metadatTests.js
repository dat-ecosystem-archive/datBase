var request = require('request').defaults({json: true})
var series = require('run-series')
var extend = require('extend')
var debug = require('debug')('test-metadat')

var TEST_DAT = {
  'owner_id': 'karissa',
  'name': 'Political organizations by state',
  'description': 'Political organizations by state with demographic information and various measures of success.',
  'url': 'http://localhost:6461',
  'datasets': [
    {name:'organizations'},
    {name:'demographic_model_output'},
    {name:'organizer_models'}
  ],
  'readme': '',
  'json': {
    dat: "Hello",
    version: "6.9.6",
    changes: 8,
    rows: 5,
    approximateSize: {
      rows: "1.57 kB"
    }
  },
  'license': 'BSD-2',
}

module.exports.createMetadat = function (test, common) {
  test('creates a new Metadat via POST', function(t) {
    var data = extend({}, TEST_DAT) // clone

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'returns 201')
        t.equal(typeof json.id, 'string', 'return id is a string')
        t.equal(json.name, data.name, 'returns corrent name')
        done()
      }
    )
  })
}

module.exports.duplicate = function(test, common) {
  test('adding a dat name that already exists for this user', function (t) {
    var data = extend({}, TEST_DAT) // clone
    data.name = 'random name'
    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'returns 201')

        request({
          method: 'POST',
          jar: jar,
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
          json: data
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(json.status, 'error', 'json status returns error')
          done()
        })
      })
  })
}
module.exports.query = function(test, common) {
  test('query by url or owner_id', function (t) {
    var data = extend({}, TEST_DAT) // clone
    data.name = 'another name'

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.equal(json.owner_id, data.owner_id)
        data.url = 'http://testing-queries.com'
        data.owner_id = 'mafintosh'

        request({
          method: 'POST',
          jar: jar,
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
          json: data,
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(json.owner_id, data.owner_id)
          t.equal(json.url, data.url)

          var fns = [
            function(next) {
              data.name = 'another'
              data.url = 'http://testing-queries2.com'
              request({
                method: 'POST',
                jar: jar,
                uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
                json: data
              }, function (err, res, json) {
                t.ifError(err)
                t.equal(json.url, data.url)
                next()
              })
            },
            function(next) {
              request({
                method: 'GET',
                jar: jar,
                uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
                json: data
              }, function (err, res, json) {
                t.ifError(err)
                t.equal(json.data.length, 3, 'querying for all returns 3')
                next()
              })
            },
            function(next) {
              request({
                method: 'GET',
                jar: jar,
                uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
                json: data,
                qs: {
                  url: data.url
                }
              }, function (err, res, json) {
                t.ifError(err)
                t.equal(json.length, 1, 'should give us one value')
                t.equal(json[0] && json[0].url, data.url, 'querying for url')
                next()
              })
            },
            function(next) {
              request({
                method: 'GET',
                jar: jar,
                uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
                json: data,
                qs: {
                  url: data.url,
                  owner_id: data.owner_id
                }
              }, function (err, res, json) {
                t.ifError(err)
                t.equal(res.statusCode, 400, '400 when querying for multiple properties')
                next()
              })
            },
            function(next) {
              request({
                method: 'GET',
                jar: jar,
                uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
                json: data,
                qs: {
                  owner_id: data.owner_id
                }
              }, function (err, res, json) {
                t.ifError(err)
                t.equal(json.length, 2, 'secondary query returns multiple results')
                t.equal(json[0].owner_id, data.owner_id, 'querying for owner id')
                next()
              })
            }
          ]

          series(fns, function(err) {
            if (err) t.ifErr(err)
            done()
          })
        })
      }
    )
  })
}


module.exports.createInvalidField = function(test, common) {
  test('invalid field type', function(t) {
    var data = extend({}, TEST_DAT) // clone
    data.owner_id = 1
    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 200, 'returns 200')
        t.equal(json.status, 'error', 'json.status is error')
        data.owner_id = 'karissa'
        done()
      }
    )
  });

  test('missing required field returns error', function(t) {
    var data = extend({}, TEST_DAT) // clone
    delete data['owner_id']

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(json.status, 'error', 'json.status is error')
        data['owner_id'] = 'karissa'
        done()
      }
    )
  });
}

module.exports.getMetadatsEmpty = function (test, common) {
  test('get a metadat with empty db', function (t) {
    common.getRegistry(t, function (err, api, done) {
      request('http://localhost:' + api.options.PORT + '/api/metadat/',
        function (err, res, json) {
          t.ifError(err)
          t.equal(res.statusCode, 200, 'returns 200')
          t.equal(json.data.length, 0, 'returns no items')
          done()
        }
      )
    })
  })
}

module.exports.deleteMetadat = function (test, common) {
  test('creates a new Metadat via POST then deletes it', function(t) {
    var data = extend({}, TEST_DAT) // clone

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'returns 201')
        t.equal(json.name, data.name, 'name is created')

        var metadatID = json.id

        request({
          method: 'DELETE',
          jar: jar,
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + metadatID,
          json: data
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(res.statusCode, 200, 'delete returns 200')

          request('http://localhost:' + api.options.PORT + '/api/metadat/' + metadatID,
            function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 404, 'get returns 404')
              done()
            }
          )
        }
      )
    })
  })
}

module.exports.getMetadats = function (test, common) {
  test('get a metadat', function (t) {
    var data = extend({}, TEST_DAT) // clone
    common.testPOST(t, '/api/metadat', data, function (err, api, jar, res, json, done) {
      t.ifError(err)
      t.equal(res.statusCode, 201, 'create returns 201')
      t.equal(json.name, data.name, 'returns name')
      t.equal(json.owner_id, data.owner_id, 'returns ownerid')
      t.equal(json.url, data.url, 'returns url')
      t.equal(json.license, data.license, 'returns license')
      debug('debugin', json)
      var metaDatUrl = 'http://localhost:' + api.options.PORT + '/api/metadat/' + json.id
      var metaDatsUrl = 'http://localhost:' + api.options.PORT + '/api/metadat'
      request(metaDatUrl, function (err, res, json) {
        t.ifError(err)
        t.equal(res.statusCode, 200, 'returns 200')
        data.id = json.id
        t.deepEqual(json, data, 'deepequal that json')
        request(metaDatsUrl, function (err, res, json) {
          t.ifError(err)
          t.equal(res.statusCode, 200, 'returns 200')
          t.equal(json.data.length, 1, 'length for 1 metadat')
          done()
        })
      })
    })
  })
}


module.exports.updateMetadat = function (test, common) {
  test('update a metadat', function (t) {
    var data = extend({}, TEST_DAT) // clone

    common.testPOST(t, '/api/metadat', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'created status')
        t.equal(json.name, data.name, 'name equal')
        t.equal(json.owner_id, data.owner_id, 'owner id equal')
        t.equal(json.url, data.url, 'url equal')
        t.equal(json.license, data.license, 'license equal')
        debug('debugin', json)

        data.name = 'test entry MODIFIED!'
        request({
          method: 'PUT',
          jar: jar,
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
          json: data
        },
          function (err, res, json) {
            t.ifError(err)
            t.equal(res.statusCode, 200, 'update returns 200')
            data.id = json.id
            t.equal(json.name, data.name, 'new name is correct')
            t.deepEqual(json, data)

            data.name = 'test entry MODIFIED 1 more time!!'
            data.owner_id = 'mafintosh'

            request({
              method: 'PUT',
              jar: jar,
              uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
              json: data
            },
              function (err, res, json) {
                t.ifError(err)
                t.equal(res.statusCode, 200, 'status is 200')
                data.id = json.id
                t.equal(json.name, data.name, 'new name')
                t.equal(json.owner_id, 'mafintosh', 'new owner name')
                t.deepEqual(json, data, 'deepequal json correct')
                done()
              }
            )
          }
        )
      }
    )
  })
}

module.exports.all = function(test, common) {
  module.exports.createMetadat(test, common);
  module.exports.query(test, common);
  module.exports.createInvalidField(test, common);
  module.exports.getMetadats(test, common);
  module.exports.getMetadatsEmpty(test, common);
  module.exports.updateMetadat(test, common);
  module.exports.duplicate(test, common);
  module.exports.deleteMetadat(test, common);
}