var test = require('tape')
var verify = require('../server/verify.js')
var opts = {whitelist: __dirname + '/whitelist.txt'}

test('user signup whitelist should reject', function (t) {
  verify({email: 'gandalf@aol.com'}, opts, function (err, status) {
    t.true(err, 'should error')
    t.equals(status, 401)
    t.equals(err.message, 'email not in invite list')
    t.end()
  })
})

test('user signup whitelist should allow', function (t) {
  verify('bilbo@baggins.co.nz', opts, function (err, status) {
    t.ifErr(err, 'should not error')
    t.equals(status, 200)
    t.end()
  })
})

test('user signup whitelist should ignore hashtag lines', function (t) {
  verify('nazgul@mordornet.ru', opts, function (err, status) {
    t.true(err, 'should error')
    t.equals(status, 401)
    t.equals(err.message, 'email not in invite list')
    t.end()
  })
})

test('user signup whitelist invalid file', function (t) {
  verify('nazgul@mordornet.ru', {whitelist: './fakefile.txt'}, function (err, status) {
    t.true(err, 'should error')
    t.equals(err.message, 'error reading invite file')
    t.equals(status, 400)
    t.end()
  })
})

test('user signup with no whitelist', function (t) {
  verify('nazgul@mordornet.ru', {whitelist: false}, function (err, status) {
    t.ifErr(err, 'should not error')
    t.equals(status, 200)
    t.end()
  })
})
