const test = require('tape')
const TownshipClient = require('township-client')
const request = require('request')
const helpers = require('../helpers')
const config = require('../config')

var url = 'http://localhost:' + config.port
var api = url + '/api/v1'
helpers.server(config, function (db, close) {
  var client = TownshipClient({
    server: 'http://localhost:' + config.port,
    config: config.townshipClient,
    routes: {
      register: '/auth/v1/register',
      login: '/auth/v1/login'
    }
  })

  var users = helpers.users
  test('api POST users should fail without login', function (t) {
    request.post({url: api + '/users', body: users.joe, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.statusCode, 400)
      t.end()
    })
  })

  test('api get users should fail without login', function (t) {
    request({url: api + '/users', json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.statusCode, 400)
      t.end()
    })
  })

  test('api should register users', function (t) {
    client.register(users.joe, function (err, resp, body) {
      t.ifError(err)
      t.same(body.email, users.joe.email)
      client.register(users.bob, function (err, resp, body) {
        t.ifError(err)
        t.same(body.email, users.bob.email)
        client.register(users.admin, function (err, resp, body) {
          t.ifError(err)
          t.same(body.email, users.admin.email)
          t.end()
        })
      })
    })
  })

  test('api should not update user if not logged in as that user', function (t) {
    request.post({url: api + '/users', body: {id: users.joe.id, username: 'margaret'}, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.statusCode, 400, 'error status code')
      t.end()
    })
  })

  test('api should be able to login as joe', function (t) {
    client.login(users.joe, function (err, resp, body) {
      t.ifError(err)
      t.same(body.email, users.joe.email)
      t.ok(body.key)
      t.ok(body.token)
      t.end()
    })
  })

  test('api should get the users we created', function (t) {
    client.secureRequest({url: '/api/v1/users', json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.length, 3, 'has three users')
      t.same(body[0].email, users.joe.email, 'has joe')
      t.same(body[1].email, users.bob.email, 'has bob')
      t.same(body[2].email, users.admin.email, 'has admin')
      t.end()
    })
  })

  //
  // test('api joe should be able to update himself', function (t) {
  //   request.put({url: url + '/users', body: {id: users.joe.id, username: 'margaret'}, json: true}, function (err, resp, body) {
  //     t.ifError(err)
  //     t.same(body.username, 'margaret', 'updated one user')
  //     request({url: url + '/users', json: true}, function (err, resp, body) {
  //       t.ifError(err)
  //       t.same(body.length, 3, 'has one user')
  //       t.same(body[0].username, 'margaret', 'user has new username')
  //       t.end()
  //     })
  //   })
  // })
  //
  //
  // test('can delete yourself', function (t) {
  //   request.delete({url: url + '/users', body: {id: users.joe.id}, json: true}, function (err, resp, body) {
  //     t.ifError(err)
  //     t.same(body.deleted, 1, 'deletes one row')
  //     request({url: url + '/users', json: true}, function (err, resp, body) {
  //       t.ifError(err)
  //       t.same(body.length, 2, 'has two users')
  //       t.end()
  //     })
  //   })
  // })

  helpers.tearDown(test, close)
})
