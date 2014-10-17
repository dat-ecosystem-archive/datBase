var request = require('request').defaults({json: true})
var level = require('level')

var testuser = {
  'handle': 'testuser',
  'password': 'password123',
  'email': 'testuser@email.com'
}
var url = 'http://localhost:5000'

module.exports.createUser = function(test, common) {
  test('creates a user via POST', function(t) {
    common.getRegistry(test, function(err, models) {
      request({method: 'POST', uri: url + '/auth/create/', json: testuser}, get)
      function get(err, result, json) {
        t.ifError(err)
        t.equal(json.handle, testuser.handle)
        models.users.get(json.handle, function(err, user) {
          t.ifError(err)
          t.equal(user.handle, testuser.handle)
          t.equal(user.email, testuser.email)
          t.end()
        })
      }
    })
  })
}

module.exports.all = function(test, common) {
  module.exports.createUser(test, common);
}