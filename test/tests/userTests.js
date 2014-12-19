var request = require('request').defaults({json: true})
var debug = require('debug')('test-users')

module.exports.onlyUpdateCurrentUser = function(test, common) {
  test('only update the current user', function(t) {
    common.testGET(t, '/auth/login',
      function (err, api, res, json, done) {
        t.ifError(err)
        request({
          method: 'PUT',
          uri: 'http://localhost:' + api.options.PORT + '/api/users/notme',
          json: {
            handle: 'notyou'
          }
        }, function (err, res, json) {
          t.ifError(err)
          t.equals(json.status, 'error', 'throws error message return')
          done()
        })
    })
  })
}

module.exports.cantCreateUser = function(test, common) {
  var data = {
    handle: 'karissa',
    password: 'blahpassword'
  }
  test('cant create a user through POST api', function(t) {
    common.testPOST(t, '/api/users', data,
      function (err, api, res, json, done) {
        t.ifError(err)
        t.equals(json.status, 'error', 'returns error in status message')

        request({
          method: 'GET',
          uri: 'http://localhost:' + api.options.PORT + '/api/users/',
        }, function (err, res, json) {
          t.ifError(err)
          t.equals(json.length, 0, 'user not created')
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