module.exports = function (opts, cb) {
  var knex = require('knex')({
    dialect: 'sqlite3',
    debug: true,
    connection: {
      filename: opts.db
    }
  })

  // Create a table
  knex.schema.createTableIfNotExists('users', function (table) {
    table.increments('id')
    table.string('nickname')
    table.string('email')
    table.string('hash')
    table.string('salt')
    table.boolean('verified')
  }).asCallback(function (err) { return cb(err, knex) })
}
