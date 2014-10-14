var request = require('request').defaults({json: true})
var level = require('level')
var db = level('/tmp/test.db')
var Users = require('../../auth/users.js')

var testuser = {
  'handle': 'testuser',
  'password': 'password123',
  'email': 'testuser@email.com'
}

var users = new Users(db)

module.exports.createUser = function(test, common) {
  test('/auth/create/ success', function(t) {
    request.post('http://localhost:5000/auth/create/', testuser, function(result) {
      users.get(testuser['handle'], function(err, user) {
        t.equal(user, testuser)
        t.end()
      })
    })
  })
}

module.exports.all = function(test, common) {
  module.exports.createUser(test, common);
}