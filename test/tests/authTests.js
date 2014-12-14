var request = require('request')
var jar = request.jar()

module.exports.loginUser = function(test, common) {
  test('login a user', function(t) {
    common.testGET(t, '/auth/login',
      function (err, api, res, json, done) {
        t.ifError(err)
        request({
          url: 'http://localhost:' + api.options.PORT + "/auth/currentuser",
          jar: jar,
          json: true
        },  function (err, res, data) {
          var c = jar.getCookies('http://localhost')[0];
          t.ok(c, 'jar here')
          t.equals(c.key, 'dat-registry', 'key is set')
          t.ok(c.value, 'value is set')
          done()
        })
      }
    )
  })
}

module.exports.all = function(test, common) {
  module.exports.loginUser(test, common);
}