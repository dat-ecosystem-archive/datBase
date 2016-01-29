var got = require('got')
var test = require('tape')
var testServer = require('./')

var user = {
  email: 'hello@world.com',
  password: 'password'
}
var PORT = 8000
var url = 'http://localhost:' + PORT
testServer(PORT, function (err, server, close) {
  if (err) throw err
  test('create user returns 201 and can login after', function (t) {
    post('/auth/create', user, function (err, json, resp) {
      t.ifError(err)
      t.equal(resp.statusCode, 201)
      t.equal(json.id, 1)
      post('/auth/login', user, function (err, json, resp) {
        t.ifError(err)
        t.equal(json.id.length, 36)
        user.id = json.id
        t.equal(json.email, 'hello@world.com')
        t.end()
      })
    })
  })

  test('verify sets correct flag', function (t) {
    post('/auth/verify', user, function (err, json, resp) {
      t.ifError(err)
      t.equal(resp.statusCode, 200)
      post('/auth/login', user, function (err, json, resp) {
        t.ifError(err)
        t.equal(json.verified, 1)
        t.end()
      })
    })
  })

  test('bad login returns 401', function (t) {
    user.password = 'badpassword'
    post('/auth/login', user, function (err, json, resp) {
      t.ok(err)
      t.equal(resp.statusCode, 401)
      t.end()
    })
  })

  test('change password and login', function (t) {
    user.newPassword = 'anotherpassword'
    post('/auth/change_password', user, function (err, json, resp) {
      t.ifError(err)
      t.equal(resp.statusCode, 200)
      user.password = user.newPassword
      post('/auth/login', user, function (err, json, resp) {
        t.ifError(err)
        t.equal(resp.statusCode, 200)
        t.end()
      })
    })
  })

  test('remove user', function (t) {
    post('/auth/remove', {id: user.id}, function (err, json, resp) {
      t.ifError(err)
      t.equal(resp.statusCode, 200)
      post('/auth/login', user, function (err, json, resp) {
        t.ok(err)
        close()
        t.end()
      })
    })
  })
})

function post (path, data, cb) {
  got.post(url + path, {json: true, body: JSON.stringify(data)}, cb)
}
