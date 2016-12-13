var Knex = require('knex')
var model = require('./model')

module.exports = function (opts, cb) {
  if (!opts) opts = {}
  var knex = Knex({
    dialect: opts.dialect || 'sqlite3',
    connection: opts.connection || { filename: './sqlite.db' }
  })

  return {
    knex: knex,
    models: {
      users: model(knex, 'users', {primaryKey: 'id'}),
      dats: model(knex, 'dats', {primaryKey: 'id'})
    }
  }
}
