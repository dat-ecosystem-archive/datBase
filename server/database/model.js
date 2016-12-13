var async = require('async')

module.exports = function (knex, model, opts) {
  if (!opts) opts = {}
  var primaryKey = opts.primaryKey || 'id'

  return {
    list: function (cb) {
      knex(model)
        .select()
        .then(function (data) { cb(null, data) })
        .catch(cb)
    },
    get: function (where, cb) {
      knex(model)
        .select()
        .where(where)
        .then(function (data) { cb(null, data) })
        .catch(cb)
    },
    update: function (where, values, cb) {
      knex(model)
      .where(where)
      .update(values)
      .then(function (id) { cb(null, id) })
      .catch(cb)
    },
    create: function (values, cb) {
      async.waterfall([
        function (done) {
          knex(model)
          .insert(values)
          .then(function (id) { done(null, id) })
          .catch(done)
        }, function (results, done) {
          var where = {}
          where[primaryKey] = values.id
          knex(model)
          .where(where)
          .then(function (data) { done(null, data[0]) })
          .catch(done)
        }], cb)
    },
    delete: function (where, cb) {
      knex(model)
        .where(where)
        .del()
        .then(function (data) { cb(null, data) })
        .catch(cb)
    }
  }
}
