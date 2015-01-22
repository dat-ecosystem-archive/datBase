var request = require('request').defaults({json: true})
var jar = request.jar()
var debug = require('debug')('test-users')

module.exports.onlyUpdateCurrentUser = function(test, common) {
  test('only update the current user', function(t) {
    common.getRegistry(t, function (err, api, done) {
      if (err) t.ifError(err)
      request({
        url: 'http://localhost:' + api.options.PORT + "/auth/github/testlogin",
        jar: jar,
        json: true
      },  function (err, res, data) {
        t.ifError(err, 'no error')
        // edit self
        request({
          method: 'PUT',
          jar: jar,
          uri: 'http://localhost:' + api.options.PORT + '/api/users/karissa',
          json: {
            handle: 'bob'
          }
        }, function (err, res, json) {
          t.ifError(err, 'no error')
          t.ok(res.statusCode, 200, '200')
          t.deepEqual(json, {id: 'karissa', handle: 'bob'}, 'resp matches')
          // edit someone else
          request({
            method: 'PUT',
            jar: jar,
            uri: 'http://localhost:' + api.options.PORT + '/api/users/notme',
            json: {
              handle: 'notyou'
            }
          }, function (err, res, json) {
            t.ifError(err, 'no error')
            t.equals(res.statusCode, 401, '401')
            t.equals(json.status, 'error', 'throws error message return')
            done()
          })
        })
      })
    })
  })
}

module.exports.cantCreateUser = function(test, common) {
  var data = {
    handle: 'pizza'
  }
  test('cant create a user through POST api', function(t) {
    common.testPOST(t, '/api/users', data,
      function (err, api, jar, res, json, done) {
        t.ifError(err)
        t.equals(json.status, 'error', 'returns error in status message')
        request({
          method: 'GET',
          uri: 'http://localhost:' + api.options.PORT + '/api/users/',
        }, function (err, res, json) {
          t.ifError(err)
          t.equals(res.statusCode, 200, '200')
          t.equals(json.data.length, 1, 'user not created')
          done()
        })
      }
    )
  })
}

module.exports.all = function(test, common) {
  module.exports.onlyUpdateCurrentUser(test, common);
  module.exports.cantCreateUser(test, common);
}
