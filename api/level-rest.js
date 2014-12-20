var validator = require('is-my-json-valid')
var concat = require('concat-stream')
var debug = require('debug')('level-rest')

module.exports = LevelREST

function LevelREST(db, options) {
  if (!(this instanceof LevelREST)) return new LevelREST(db, options)
  options = options || {}
  this.db = db
  this.options = options
  if (options.schema) this.validate = validator(options.schema)
  this.generateId = options.generateId || function() {
    return +Date.now()
  }.bind(this)
}

LevelREST.prototype.get = function(opts, cb) {
  var self = this
  if (!opts.id) return this.getAll(opts, cb)
  debug('get', opts)
  this.db.get(opts.id, opts, function(err, row) {
    if (err) return cb(err)
    cb(null, row)
  })
}

LevelREST.prototype.getAll = function(opts, cb) {
  var self = this
  if (!opts) opts = {}
  if (!opts.limit) opts.limit = this.options.pageLimit || 50
  if (opts.limit > this.options.pageLimit) {
    var msg = 'limit must be under ' + this.options.pageLimit
    return cb(new Error(msg))
  }
  debug('getAll', opts)
  var getStream = this.db.createValueStream(opts)
  getStream.on('error', cb)
  getStream.pipe(concat(function concatenator(rows) {
    cb(null, {data: rows})
  }))
}

LevelREST.prototype.put = function(data, opts, cb) {
  if (!opts) opts = {}
  debug('put', data, opts)
  if (!this.validate(data)) {
    var errors = this.validate.errors
    return cb(null, {status: "error", errors: errors})
  }
  this.db.put(opts.id, data, opts, function(err) {
    if (err) return cb(err)
    data.id = opts.id
    cb(null, data)
  })
}

LevelREST.prototype.post = function(data, opts, cb) {
  if (!opts) opts = {}
  if (!opts.id) opts.id = this.generateId()
  debug('post', data, opts)
  this.put(data, opts, cb)
}

// Delete a record on an endpoint, ie: DELETE posts/123
LevelREST.prototype.delete = function(opts, cb) {
  if (!opts) opts = {}
  debug('delete', opts)
  this.db.del(opts.id, opts, function(err) {
    if (err) return cb(err)
    cb()
  })
}
