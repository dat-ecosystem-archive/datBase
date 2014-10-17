var request = require('request').defaults({json: true})
var level = require('level')

var url = 'http://localhost:5000'

module.exports.createUser = function(test, common) {
  test('creates a user via POST', function(t) {
    var testUser = {
      'handle': 'testuser',
      'password': 'password123',
      'email': 'testuser@email.com'
    }
    common.getRegistry(test, function(err, models) {
      params = {
        method: 'POST',
        uri: url + '/auth/create/',
        json: testUser
      }
      request(params, function get(err, res, json) {
        t.ifError(err)
        t.equal(res.statusCode, 200)
        t.equal(json.handle, testUser.handle)
        models.users.get(json.handle, function(err, user) {
          t.ifError(err)
          t.equal(user.handle, testUser.handle)
          t.equal(user.email, testUser.email)
          t.end()
        })
      })
    })
  })
}

module.exports.loginUser = function(test, common) {
  test('login a user', function(t) {
    var testData = {
      'handle': 'testuser',
      'password': 'password123'
    }
  })
}

module.exports.all = function(test, common) {
  module.exports.createUser(test, common);
  module.exports.loginUser(test, common);
}