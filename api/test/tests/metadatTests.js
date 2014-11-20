var request = require('request').defaults({json: true})
var debug = require('debug')('test-metadat')

module.exports.createMetadat = function (test, common) {
  test('creates a new Metadat via POST', function(t) {
    var data = {
      'owner_id': 'mafintosh',
      'name': 'test entry',
      'description': 'i am a description',
      'url': 'http://dat-data.dathub.org',
      'json': {
        'name': 'some-name',
        'version': 1.3
      },
      'license': 'BSD-2'
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    }

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201)
        t.equal(typeof json.id, 'number')
        t.equal(json.name, data.name)
        done()
      }
    )
  });

  test('invalid field type throws 400', function(t) {
    var data = {
      'owner_id': 1,
      'name': 'hello',
      'description': 'i am a description',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2',
      'json': {
        'name': 'some-name',
        'version': 1.3
      }
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    }

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 400)
        done()
      }
    )
  });

  test('missing required field throws 400', function(t) {
    var data = {
      'owner_id': 'karissa',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2',
      'description': 'i am a description',
      'json': {
        'name': 'some-name',
        'version': 1.3
      }
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    }

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 400)
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
          t.equal(res.statusCode, 200)
          t.equal(json.length, 0)
          done()
        }
      )
    })
  })
}

module.exports.deleteMetadat = function (test, common) {
  test('creates a new Metadat via POST then deletes it', function(t) {
    var data = {
      'owner_id': 'mafintosh',
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2',
      'description': 'i am a description',
      'json': {
        'name': 'some-name',
        'version': 1.3
      }
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    }

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201)
        t.equal(json.name, data.name)

        var metadatID = json.id

        request({
          method: 'DELETE',
          uri: 'http://localhost:' + api.options.PORT + '/api/metadat/' + metadatID,
          json: data
        }, function (err, res, json) {
          t.ifError(err)
          t.equal(res.statusCode, 200)

          request('http://localhost:' + api.options.PORT + '/api/metadat/' + metadatID,
            function (err, res, json) {
              t.ifError(err)
              t.equal(res.statusCode, 204)
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

    var data = {
      'owner_id': 'karissa',
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2',
      'description': 'i am a description',
      'json': {
        'name': 'some-name',
        'version': 1.3
      }
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    }

    common.testPOST(t, '/api/metadat', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equal(res.statusCode, 201)
        t.equal(json.name, data.name)
        t.equal(json.owner_id, data.owner_id)
        t.equal(json.url, data.url)
        t.equal(json.license, data.license)
        debug('debugin', json)

        request('http://localhost:' + api.options.PORT + '/api/metadat/' + json.id,
          function (err, res, json) {
            t.ifError(err)
            t.equal(res.statusCode, 200)
            data.id = json.id
            t.deepEqual(json, data)

            request('http://localhost:' + api.options.PORT + '/api/metadat',
              function (err, res, json) {
                t.ifError(err)
                t.equal(res.statusCode, 200)
                t.equal(json.length, 1)
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
  test('get a metadat', function (t) {
    var data = {
      'owner_id': 'karissa',
      'name': 'test entry',
      'url': 'http://dat-data.dathub.org',
      'license': 'BSD-2',
      'description': 'i am a description',
      'json': {
        'name': 'some-name',
        'version': 1.3
      }
     // 'keywords': ['entry', 'test', 'data', 'dathub']
    }

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
            t.equal(res.statusCode, 200)
            data.id = json.id
            t.equal(json.name, 'test entry MODIFIED!')
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
                t.equal(res.statusCode, 200)
                data.id = json.id
                t.equal(json.name, 'test entry MODIFIED 1 more time!!')
                t.equal(json.owner_id, 'mafintosh')
                t.deepEqual(json, data)
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