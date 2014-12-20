var request = require('request').defaults({json: true})
var debug = require('debug')('test-metadat')

var TEST_DAT = {
  'owner_id': 'mafintosh',
  'name': 'test entry',
  'description': 'i am a description',
  'url': 'http://dat-data.dathub.org',
  'json': {
    'name': 'some-name',
    'version': 1.3
  },
  'license': 'BSD-2',
}
 // 'keywords': ['entry', 'test', 'data', 'dathub']

module.exports.createMetadat = function (test, common) {
  test('creates a new Metadat via POST', function(t) {
    var data = TEST_DAT

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'returns 201')
        t.equal(typeof json.id, 'number', 'return id is a number')
        t.equal(json.name, data.name, 'returns corrent name')
        done()
      }
    )
  });

  test('invalid field type', function(t) {
    var data = TEST_DAT
    data.owner_id = 1
    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 200, 'returns 200')
        t.equal(json.status, 'error', 'json.status is error')
        data.owner_id = 'karissa'
        done()
      }
    )
  });

  test('query by url or owner_id', function (t) {
    var data = TEST_DAT
    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        data.url = 'http://testing-queries.com'
        data.owner_id = 'karissa'

        request({
          method: 'POST',
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
          json: data,
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(json.url, data.url)
          
          request({
            method: 'GET',
            uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
            json: data
          }, function (err, res, json) {
            t.ifError(err)
            t.equal(json.data.length, 2, 'querying for all returns 2')
          })

          request({
            method: 'GET',
            uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
            json: data,
            qs: {
              url: data.url
            }
          }, function (err, res, json) {
            t.ifError(err)
            t.equal(json.url, data.url, 'querying for url')
          })

          request({
            method: 'GET',
            uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
            json: data,
            qs: {
              owner_id: data.owner_id
            }
          }, function (err, res, json) {
            t.ifError(err)
            t.equal(json.owner_id, data.owner_id, 'querying for owner id')
            done()
          })
        })
      }
    )
  })

  // test('adding a dat name that already exists for this user', function (t) {
  //   var data = TEST_DAT
  //   common.testPOST(t, '/api/metadat', data,
  //     function (err, api, res, json, done) {

  //       request({
  //         method: 'POST',
  //         uri: 'http://localhost:' + api.options.PORT + '/api/metadat/',
  //         json: data
  //       }, function (err, res, json) {
  //         t.ifError(err)
  //         t.equal(res.statusCode, 200, 'returns 200')
  //         done()
  //       })
  //     })
  // })

  test('missing required field returns error', function(t) {
    var data = TEST_DAT
    delete data['owner_id']

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
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
    var data = TEST_DAT

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'returns 201')
        t.equal(json.name, data.name, 'name is created')

        var metadatID = json.id

        request({
          method: 'DELETE',
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + metadatID,
          json: data
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(res.statusCode, 200, 'delete returns 200')

          request('http://localhost:' + api.options.PORT + '/api/metadat/' + metadatID,
            function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 204, 'get returns 204')
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

    var data = TEST_DAT

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'create returns 201')
        t.equal(json.name, data.name, 'returns name')
        t.equal(json.owner_id, data.owner_id, 'returns ownerid')
        t.equal(json.url, data.url, 'returns url')
        t.equal(json.license, data.license, 'returns license')
        debug('debugin', json)

        request('http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
          function (err, res, json) {
            t.ifError(err)
            t.equal(res.statusCode, 200, 'returns 200')
            data.id = json.id
            t.deepEqual(json, data, 'deepequal that json')

            request('http://localhost:' + api.options.PORT + '/api/metadat',
              function (err, res, json) {
                t.ifError(err)
                t.equal(res.statusCode, 200, 'returns 200')
                t.equal(json.data.length, 1, 'length for 1 metadat')
                done()
              }
            )
          }
        )
      }
    )

  })
}


module.exports.updateMetadat = function (test, common) {
  //TODO: callback hell! want to use promises?
  test('update a metadat', function (t) {
    var data = TEST_DAT

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201, 'created status')
        t.equal(json.name, data.name, 'name equal')
        t.equal(json.owner_id, data.owner_id, 'owner id equal')
        t.equal(json.url, data.url, 'url equal')
        t.equal(json.license, data.license, 'license equal')
        debug('debugin', json)

        data['name'] = 'test entry MODIFIED!'
        request({
          method: 'PUT',
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
          json: data
        },
          function (err, res, json) {
            t.ifError(err)
            t.equal(res.statusCode, 200, 'update returns 200')
            data.id = json.id
            t.equal(json.name, 'test entry MODIFIED!', 'new name is correct')
            t.deepEqual(json, data)

            data['name'] = 'test entry MODIFIED 1 more time!!'
            data['owner_id'] = 'mafintosh'

            request({
              method: 'PUT',
              uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
              json: data
            },
              function (err, res, json) {
                t.ifError(err)
                t.equal(res.statusCode, 200, 'status is 200')
                data.id = json.id
                t.equal(json.name, 'test entry MODIFIED 1 more time!!', 'new name')
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
  module.exports.getMetadats(test, common);
  module.exports.getMetadatsEmpty(test, common);
  module.exports.updateMetadat(test, common);
  module.exports.deleteMetadat(test, common);
}