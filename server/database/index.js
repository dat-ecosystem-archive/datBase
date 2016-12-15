var Knex = require('knex')
var model = require('./model')

module.exports = function (opts, cb) {
  if (!opts) opts = {}
  var knex = Knex(opts)

  return {
    knex: knex,
    models: {
      users: model(knex, 'users', {primaryKey: 'id'}),
      dats: model(knex, 'dats', {primaryKey: 'id'})
    }
  }
}
