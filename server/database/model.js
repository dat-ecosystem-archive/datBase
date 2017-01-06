const async = require('async')
const uuid = require('uuid')
const errors = require('../errors')
const validators = require('./validate')

module.exports = function (knex, model, opts) {
  if (!opts) opts = {}
  var primaryKey = opts.primaryKey || 'id'
  var validate = validators[model]

  return {
    list: function (cb) {
      knex(model)
        .select()
        .then(function (data) { cb(null, data) })
        .catch(function (err) { return cb(errors.humanize(err)) })
    },
    get: function (where, cb) {
      if (!where) return cb(new Error('Query required as an argument to model.get'))
      var limit = Number(where.limit) || 100
      var offset = Number(where.offset) || 0
      delete where.limit
      delete where.offset

      knex(model)
        .select()
        .where(where)
        .limit(limit)
        .offset(offset)
        .then(function (data) { cb(null, data) })
        .catch(function (err) { return cb(errors.humanize(err)) })
    },
    update: function (where, values, cb) {
      if (!where) return cb(new Error('Query required as an argument to model.update'))
      if (!values) return cb(new Error('Values required as an argument to model.update'))
      if (validate) {
        validate(values)
        if (validate.errors) return cb(new Error(validate.errors[0].field + ' ' + validate.errors[0].message))
      }
      if (!values.updated_at) values.updated_at = Date.now()
      knex(model)
      .where(where)
      .update(values)
      .then(function (data) { cb(null, data) })
      .catch(onerror)

      function onerror (err) {
        return cb(errors.humanize(err))
      }
    },
    create: function (values, cb) {
      if (!values) return cb(new Error('Values required as an argument to model.create'))
      if (validate) {
        validate(values)
        if (validate.errors) return cb(new Error(validate.errors[0].field + ' ' + validate.errors[0].message))
      }

      values[primaryKey] = uuid.v4()
      async.waterfall([
        function (done) {
          knex(model)
          .insert(values)
          .returning('id')
          .then(function () { done(null) })
          .catch(done)
        }, function (done) {
          var where = {}
          where[primaryKey] = values[primaryKey]
          knex(model)
          .where(where)
          .then(function (data) { done(null, data[0]) })
          .catch(done)
        }],
        finish
      )

      function finish (err, data) {
        if (err) return cb(errors.humanize(err))
        return cb(null, data)
      }
    },
    delete: function (where, cb) {
      if (!where) return cb(new Error('Query required as an argument to model.delete'))
      knex(model)
        .where(where)
        .del()
        .then(function (data) { cb(null, data) })
        .catch(function (err) { return cb(errors.humanize(err)) })
    }
  }
}
