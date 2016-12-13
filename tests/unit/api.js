var test = require('tape')
var path = require('path')
var helpers = require('../helpers')
var fs = require('fs')
var request = require('request')

var townshipPath = path.join(__dirname, 'test-township.db')
var sqlitePath = path.join(__dirname, 'test-sqlite.db')
var config = {
  township: {
    db: townshipPath
  },
  db: {
    dialect: 'sqlite3',
    connection: { filename: sqlitePath }
  },
  port: 8111
}

var url = 'http://localhost:' + config.port + '/api/v1'

helpers.server(config, function (close) {
  var user = {id: 'bahah', username: 'bob', email: 'hello', description: 'hello i am a description'}
  test('api should get users', function (t) {
    request(url + '/users', function (err, resp, body) {
      t.ifError(err)
      t.same(JSON.parse(body), [], 'no users yet')
      t.end()
    })
  })

  test('api should create users', function (t) {
    request.post({url: url + '/users', body: user, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body, user, 'user successfully created')
      t.end()
    })
  })

  test('api should get the user we created', function (t) {
    request({url: url + '/users', json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.length, 1, 'has one user')
      t.same(body[0], user, 'user is same as the one we have')
      t.end()
    })
  })

  test('api should update user', function (t) {
    request.put({url: url + '/users', body: {id: user.id, username: 'joe'}, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.updated, 1, 'updated one user')
      request({url: url + '/users', json: true}, function (err, resp, body) {
        t.ifError(err)
        t.same(body.length, 1, 'has one user')
        t.same(body[0].username, 'joe', 'user has new username')
        t.end()
      })
    })
  })

  test('api should delete users', function (t) {
    request.delete({url: url + '/users', body: {id: user.id}, json: true}, function (err, resp, body) {
      t.ifError(err)
      t.same(body.deleted, 1, 'deletes one row')
      request({url: url + '/users', json: true}, function (err, resp, body) {
        t.ifError(err)
        t.same(body.length, 0, 'has zero users')
        t.end()
      })
    })
  })

  test.onFinish(function () {
    close()
    fs.unlink(townshipPath, function () {
      fs.unlink(sqlitePath, function () {
      })
    })
  })
})
