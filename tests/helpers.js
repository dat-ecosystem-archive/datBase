const http = require('http')
const createRouter = require('../server/router')
const initDb = require('../server/database/init')

module.exports = {
  server: function (config, cb) {
    const router = createRouter(config)

    const server = http.createServer(router)
    initDb(config.db, function (err, db) {
      if (err) throw err

      function close () {
        server.close()
      }
      server.listen(config.port, function () { cb(close) })
    })
  }
}
