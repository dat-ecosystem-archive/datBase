var request = require('request')
var jar = request.jar()


var req = function(path, port, cb) {
  request({
    url: 'http://localhost:' + port + path,
    jar: jar,
    json: true
  }, cb)
}
module.exports.loginUser = function(test, common) {
  test('login a user', function(t) {
    common.testGET(t, '/auth/login',
      function (err, api, res, json, done) {
        t.ifError(err)
        req('/auth/currentuser', api.options.PORT, function (err, res, data) {
          var c = jar.getCookies('http://localhost')[0];
          t.ok(c)
          t.equals(c.key, 'dat-registry')
          done()
        })
      }
    )
  })
}

module.exports.all = function(test, common) {
  module.exports.loginUser(test, common);
}