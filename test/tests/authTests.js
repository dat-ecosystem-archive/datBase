var request = require('request')
var testUser = require('../testUser.json')
var jar = request.jar()

module.exports.loginUser = function(test, common) {
  test('login a user', function(t) {
    common.getRegistry(t, function (err, api, done) {
      if (err) t.ifError(err)
      request({
        url: 'http://localhost:' + api.options.PORT + "/auth/github/testlogin",
        jar: jar,
        json: true
      },  function (err, res, data) {
        var c = jar.getCookies('http://localhost')[0] || {};
        t.ok(c, 'jar here')
        t.equals(c.key, 'dathub', 'key is set')
        t.ok(c.value, 'value is set')
        done()
      })
    })
  })
}

module.exports.all = function(test, common) {
  module.exports.loginUser(test, common);
}