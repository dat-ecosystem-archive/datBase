const test = require('tape')
const path = require('path')
const helpers = require('../helpers')
const initDb = require('../../server/api/database/init')
const Config = require('../../server/config')
var db

// XXX: cloning the config is necessary for tape to not clobber eachother
var users = JSON.parse(JSON.stringify(helpers.users))
var dats = JSON.parse(JSON.stringify(helpers.dats))
var config = JSON.parse(JSON.stringify(Config()))
delete users.joe.password
delete users.bob.password

test('db', function (t) {
  config.db.connection.filename = path.join(__dirname, 'test-db.sqlite')
  initDb(config.db.connection.filename, function (err, adb) {
    if (err) throw err
    db = adb
    t.end()
  })
})

test('database should create users', function (t) {
  users.joe.id = 'anewid'
  db.models.users.create(users.joe, function (err, body) {
    t.ifError(err)
    t.same(body.name, users.joe.name, 'user successfully created')
    t.end()
  })
})

test('database should get users', function (t) {
  db.models.users.get(function (err, body) {
    t.ifError(err)
    t.same(body.length, 1, 'only one user')
    t.same(body[0].username, users.joe.username, 'new user is in the list')
    t.end()
  })
})

test('database should create users', function (t) {
  users.bob.id = 'deadbeef'
  db.models.users.create(users.bob, function (err, body) {
    t.ifError(err)
    t.same(body.username, users.bob.username, 'user successfully created')
    t.end()
  })
})

test('database should get new users', function (t) {
  db.models.users.get(function (err, body) {
    t.ifError(err)
    t.same(body.length, 2, 'has two users')
    t.same(body[0].username, users.joe.username, 'joe is in the list')
    t.same(body[1].username, users.bob.username, 'bob is in the list')
    t.end()
  })
})

test('database should get a single user', function (t) {
  db.models.users.get({id: users.bob.id}, function (err, body) {
    t.ifError(err)
    t.same(body.length, 1, 'has one user')
    t.same(body[0].username, users.bob.username, 'bob is in the list')
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

test('cant create two dats with the same name in the same account', function (t) {
  dats.cats.user_id = users.bob.id
  db.models.dats.create(dats.cats, function (err, body) {
    t.ifError(err)
    t.same(body.description, dats.cats.description, 'created the cats')
    t.ok(body.created_at, 'has created_at')
    db.models.dats.create(dats.cats, function (err, body) {
      t.ok(err)
      t.ok(err.message.indexOf('already exists'), 'already exists message')
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

test('teardown', function (t) {
  helpers.tearDown(config, function () {
    db.knex.destroy(function () {
      t.end()
    })
  })
})
