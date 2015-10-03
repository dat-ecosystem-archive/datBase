var util = require('util')
var concat = require('concat-stream')
var validator = require('is-my-json-valid')
var accountdown = require('accountdown')
var debug = require('debug')('users')
var schema = require('./users.json')

module.exports = Users

function Users (db, opts) {
  if (!(this instanceof Users)) return new Users(db, opts)
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = schema
  this.schema = opts.schema
  this.options = opts
  if (this.options.schema) this.validate = validator(this.options.schema)
  this.db = db
  this.accounts = accountdown(db)
}

Users.prototype.authorize = function (opts, userData, cb) {
  // only allow users to edit their own data
  if (opts.params.id) {
    if (opts.params.id !== userData.user.handle) return cb(new Error('action not allowed'))
  }
  cb(null, userData)
}

Users.prototype.get = function (opts, cb) {
  var self = this
  if (!opts.id) return this.getAll(opts, cb)
  debug('get', opts)
  this.accounts.get(opts.id, function (err, row) {
    if (err) return cb(err)
    cb(null, row)
  })
}

Users.prototype.getAll = function (opts, cb) {
  var self = this
  if (!opts) opts = {}
  if (!opts.limit) opts.limit = this.options.pageLimit || 50
  if (opts.limit > this.options.pageLimit) {
    var msg = 'limit must be under ' + this.options.pageLimit
    return cb(new Error(msg))
  }
  debug('getAll', opts)
  var getStream = this.accounts.list(opts)
  getStream.on('error', cb)
  getStream.pipe(concat(function concatenator (rows) {
    cb(null, {data: rows})
  }))
}

// set profile data for existing user
Users.prototype.put = function (data, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}
  debug('put', data, opts)
  if (!this.validate(data)) {
    var errors = this.validate.errors
    return cb(null, {status: 'error', message: 'Fails schema validation', errors: errors})
  }
  this.accounts.put(opts.id, data, function (err) {
    if (err) return cb(err)
    data.id = opts.id
    cb(null, {created: false, data: data})
  })
}

// do not allow POST for users
Users.prototype.post = function (data, opts, cb) {
  debug('post', opts)
  var err = new Error('creating users is not allowed')
  err.statusCode = 403
  setImmediate(function () {
    cb(err)
  })
}

Users.prototype.delete = function (opts, cb) {
  if (!opts) opts = {}
  debug('delete', opts)
  this.accounts.remove(opts.id, function (err) {
    if (err) return cb(err)
    cb()
  })
}
