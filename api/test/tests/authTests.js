var request = require('request').defaults({json: true})
var level = require('level')

var testuser = {
  'handle': 'testuser',
  'password': 'password123',
  'email': 'testuser@email.com'
}


module.exports.createUser = function(test, common) {
  test('/auth/create/ success', function(t) {
    common.getRegistry(test, function(err, models) {
      request.post('http://localhost:5000/auth/create/', testuser, function(err, result) {
        if (err) throw err
        models.users.get(testuser['handle'], function(err, user) {
          if (err) throw err
          t.deepEqual(user, testuser)
          t.end()
        })
      })
    })
  })
}

module.exports.all = function(test, common) {
  module.exports.createUser(test, common);
}