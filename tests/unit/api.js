const test = require('tape')
const request = require('request')
const helpers = require('../helpers')
const config = require('../config')

var url = 'http://localhost:' + config.port + '/api/v1'

helpers.server(config, function (db, close) {
  var users = helpers.users
  test('api should get users', function (t) {
    request(url + '/users', function (err, resp, body) {
      t.ifError(err)
      t.same(JSON.parse(body), [], 'no users yet')
      t.end()
    })
  })

  test('database should create users', function (t) {
    db.models.users.create(users.joe, function (err, body) {
      t.ifError(err)
      t.same(body, users.joe, 'user successfully created')
      db.models.users.create(users.bob, function (err, body) {
        t.ifError(err)
        t.same(body, users.bob, 'user successfully created')
        db.models.users.create(users.admin, function (err, body) {
          t.ifError(err)
          t.same(body, users.admin, 'user successfully created')
          t.end()
        })
      })
    })
  })

  test('api should get the user we created', function (t) {
    request({url: url + '/users', json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.length, 3, 'has three users')
      t.same(body[0], users.joe, 'users are same as the ones we have')
      t.end()
    })
  })

  test('api should update user', function (t) {
    request.put({url: url + '/users', body: {id: users.joe.id, username: 'margaret'}, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.username, 'margaret', 'updated one user')
      request({url: url + '/users', json: true}, function (err, resp, body) {
        t.ifError(err)
        t.same(body.length, 3, 'has one user')
        t.same(body[0].username, 'margaret', 'user has new username')
        t.end()
      })
    })
  })

  test('api should delete users', function (t) {
    request.delete({url: url + '/users', body: {id: users.joe.id}, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.deleted, 1, 'deletes one row')
      request({url: url + '/users', json: true}, function (err, resp, body) {
        t.ifError(err)
        t.same(body.length, 2, 'has two users')
        t.end()
      })
    })
  })

  helpers.tearDown(test, close)
})
