const fs = require('fs')
const rimraf = require('rimraf')
const Dats = require('../server/dats')
const initDb = require('../server/api/database/init')
const Server = require('../server')

module.exports = {
  server: function (config, cb) {
    initDb(config.db, function (err, db) {
      if (err) throw err
      config.dats = Dats(config.archiver)
      config.database = db
      const server = Server(config)
      server.listen(config.port, function () {
        cb(db, close)
      })
      function close (cb) {
        server.close(function () {
          config.dats.close(function () {
            db.knex.destroy(cb)
          })
        })
      }
    })
  },
  tearDown: function (config, close) {
    rimraf(config.township.db, function () {
      fs.unlink(config.db.connection.filename, function () {
        close()
      })
    })
  },
  users: {
    joe: {name: 'joe schmo', username: 'joe', password: 'very secret', email: 'hi@joe.com', description: 'hello i am a description', token: null, role: 'user'},
    bob: {name: 'bob smob', username: 'bob', password: 'so secret', email: 'hi@bob.com', description: 'i like it', token: null, role: 'user'},
    admin: {name: 'pam spam', username: 'pam', password: 'secret123', email: 'hi@pam.com', description: 'i dont eat it', token: null, role: 'admin'}
  },
  dats: {
    cats: {name: 'cats', url: 'dat://ahashfordats', title: 'all of the cats', description: 'live on the corner of washington and 7th', keywords: 'furry, fluffy'},
    penguins: {name: 'penguins', url: 'dat://ahashforpenguins', title: 'all of the penguins', description: 'lives in your house', keywords: 'sloppy, loud'},
    dogs: {name: 'dogs', url: 'dat://ahashfordogs', title: 'all of the dogs', description: 'lives in your house', keywords: 'sloppy, loud'}
  }
}
