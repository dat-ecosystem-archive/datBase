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
        fs.unlink(config.townshipClient.filepath, function () {
          fs.unlink(config.db.connection.filename, function () {
            close(function () {
              process.exit(0) // hack to close the db
            })
          })
        })
      })
    })
  },
  users: {
    bob: {username: 'joe', password: 'very secret', email: 'hi@bob.com', description: 'hello i am a description', token: null, role: 'user'},
    joe: {username: 'bob', password: 'so secret', email: 'hi@joe.com', description: 'i like it', token: null, role: 'user'},
    admin: {username: 'pam', password: 'secret123', email: 'hi@pam.com', description: 'i dont eat it', token: null, role: 'admin'}
  },
  dats: {
    cats: {name: 'cats', url: 'dat://ahashfordats', title: 'all of the cats', description: 'live on the corner of washington and 7th', keywords: 'furry, fluffy'},
    dogs: {name: 'dogs', url: 'dat://ahashfordogs', title: 'all of the dogs', description: 'lives in your house', keywords: 'sloppy, loud'}
  }
}
