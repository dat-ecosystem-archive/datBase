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
      if (!where) return cb(new Error('Query required as an argument to model.get'))
      knex(model)
        .select()
        .where(where)
        .then(function (data) { cb(null, data) })
        .catch(cb)
    },
    update: function (where, values, cb) {
      if (!where) return cb(new Error('Query required as an argument to model.update'))
      if (!values) return cb(new Error('Values required as an argument to model.update'))
      knex(model)
      .where(where)
      .update(values)
      .then(function (data) { cb(null, data) })
      .catch(cb)
    },
    create: function (values, cb) {
      if (!values) return cb(new Error('Values required as an argument to model.create'))
      async.waterfall([
        function (done) {
          knex(model)
          .insert(values)
          .then(function () { done(null) })
          .catch(done)
        }, function (done) {
          var where = {}
          where[primaryKey] = values.id
          knex(model)
          .where(where)
          .then(function (data) { done(null, data[0]) })
          .catch(done)
        }], cb)
    },
    delete: function (where, cb) {
      if (!where) return cb(new Error('Query required as an argument to model.delete'))
      knex(model)
        .where(where)
        .del()
        .then(function (data) { cb(null, data) })
        .catch(cb)
    }
  }
}
