var createDb = require('./createDb.js')

module.exports = function (opts, cb) {
  createDb(opts, function (err, knex) {
    cb(err, knex)
  })
}
