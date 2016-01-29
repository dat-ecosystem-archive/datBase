var Knex = require('knex')

module.exports = function (opts, cb) {
  var knex = Knex({
    dialect: opts.dialect,
    debug: opts.debug,
    connection: opts.connection
  })
  knex.schema.hasTable('users').then(function (exists) {
    if (exists) return cb(null, knex)

    knex.schema.createTable('users', function (table) {
      table.uuid('id').primary().unique()
      table.string('nickname')
      table.string('email')
      table.string('hash')
      table.string('salt')
      table.boolean('verified')
    }).asCallback(function (err) {
      if (err) return cb(err)
      return cb(null, knex)
    })
  })
}
