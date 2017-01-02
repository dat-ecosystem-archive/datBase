var Knex = require('knex')
var model = require('./model')
var queries = require('./queries')

module.exports = function (opts, cb) {
  if (!opts) opts = {}
  opts.timezone = 'UTC'
  var knex = Knex(opts)
  var models = {
    users: model(knex, 'users', {primaryKey: 'id'}),
    dats: model(knex, 'dats', {primaryKey: 'id'})
  }
  var db = {
    knex: knex,
    models: models
  }
  db.queries = queries(knex, models)
  return db
}
