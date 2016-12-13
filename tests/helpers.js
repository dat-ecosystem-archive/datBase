const http = require('http')
const fs = require('fs')
const rimraf = require('rimraf')
const createRouter = require('../server/router')
const initDb = require('../server/database/init')
const config = require('./config')

module.exports = {
  server: function (config, cb) {
    const router = createRouter(config)
    const server = http.createServer(router)
    initDb(config.db, function (err, db) {
      if (err) throw err
      server.listen(config.port, function () { cb(db, server.close.bind(server)) })
    })
  },
  tearDown: function (test, close) {
    test.onFinish(function () {
      rimraf(config.township.db, function () {
        fs.unlink(config.db.connection.filename, function () {
          close(function () {
            process.exit(0) // hack to close the db
          })
        })
      })
    })
  },
  users: {
    bob: {username: 'joe', password: 'very secret', id: 'deadbeef', email: 'hi@bob.com', description: 'hello i am a description', token: null, role: 'user'},
    joe: {username: 'bob', password: 'so secret', id: 'healthybeef', email: 'hi@joe.com', description: 'i like it', token: null, role: 'user'},
    admin: {username: 'pam', password: 'secret123', id: 'alivebeef', email: 'hi@pam.com', description: 'i dont eat it', token: null, role: 'admin'}
  }
}
