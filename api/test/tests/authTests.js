module.exports.loginUser = function(test, common) {
  test('login a user', function(t) {
    var testData = {
      'handle': 'testuser',
      'password': 'password123'
    }
    t.end()
  })
}

module.exports.all = function(test, common) {
  module.exports.loginUser(test, common);
}