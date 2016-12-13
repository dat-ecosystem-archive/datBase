var Knex = require('knex')

module.exports = function (opts) {
  var knex = Knex({
    dialect: opts.dialect || 'sqlite3',
    connection: opts.connection || { filename: './data.db' }
  })

  knex.schema.createTableIfNotExists('users', function (table) {
    table.increments('id')
    table.string('user_name')
  })
  .createTableIfNotExists('dats', function (table) {
    table.increments('id')
    table.integer('user_id').unsigned().references('users.id')
    table.string('name')
    table.string('hash')
    table.string('title')
    table.text('description')
    table.text('keywords')
  })
  return knex
}
