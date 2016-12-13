const test = require('tape')
const config = require('../config')
const helpers = require('../helpers')

helpers.server(config, function (db, close) {
  var users = helpers.users
  delete users.joe.password
  delete users.bob.password

  test('database should create users', function (t) {
    db.models.users.create(users.joe, function (err, body) {
      t.ifError(err)
      t.same(body, users.joe, 'user successfully created')
      t.end()
    })
  })

  test('database should get users', function (t) {
    db.models.users.list(function (err, body) {
      t.ifError(err)
      t.same(body.length, 1, 'only one user')
      t.same(body[0], users.joe, 'new user is in the list')
      t.end()
    })
  })

  test('database should create users', function (t) {
    db.models.users.create(users.bob, function (err, body) {
      t.ifError(err)
      t.same(body, users.bob, 'user successfully created')
      t.end()
    })
  })

  test('database should get new users', function (t) {
    db.models.users.list(function (err, body) {
      t.ifError(err)
      t.same(body.length, 2, 'has two users')
      t.same(body[0], users.joe, 'joe is in the list')
      t.same(body[1], users.bob, 'bob is in the list')
      t.end()
    })
  })

  test('database should get a single user', function (t) {
    db.models.users.get({id: users.bob.id}, function (err, body) {
      t.ifError(err)
      t.same(body.length, 1, 'has one user')
      t.same(body[0], users.bob, 'bob is in the list')
      t.end()
    })
  })

  test('database should update a single user', function (t) {
    users.bob.username = 'i am not bob actually'
    db.models.users.update({id: users.bob.id}, {username: users.bob.username}, function (err, body) {
      t.ifError(err)
      t.same(body, 1, 'updated one item')
      db.models.users.get({id: users.bob.id}, function (err, body) {
        t.ifError(err)
        t.same(body.length, 1, 'get bob')
        t.same(body[0].username, users.bob.username, 'bob has a new name')
        t.end()
      })
    })
  })

  test('database should delete a single user', function (t) {
    users.bob.username = 'i am not bob actually'
    db.models.users.delete({id: users.bob.id}, function (err, body) {
      t.ifError(err)
      t.same(body, 1, 'deleted one item')
      db.models.users.get({id: users.bob.id}, function (err, body) {
        t.ifError(err)
        t.same(body.length, 0, 'bob doesnt exist')
        t.end()
      })
    })
  })

  helpers.tearDown(test, close)
})
