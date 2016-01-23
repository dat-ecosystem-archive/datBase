var Knex = require('knex')

module.exports = function (opts, cb) {
  var knex = Knex({
    dialect: opts.dialect,
    debug: opts.debug,
    connection: opts.connection
  })

  knex.schema.createTableIfNotExists('users', function (table) {
    table.uuid('id')
    table.string('nickname')
    table.string('email')
    table.string('hash')
    table.string('salt')
    table.boolean('verified')
  }).asCallback(function (err) {
    if (err) return cb(err)

    knex.schema.createTableIfNotExists('metadat', function (table) {
      table.uuid('id')
      table.string('url')
      table.string('owner').references('id').inTable('users')
    }).asCallback(function (err) { return cb(err, knex) })
  })
}
