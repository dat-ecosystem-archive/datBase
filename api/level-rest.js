var validator = require('is-my-json-valid')
var concat = require('concat-stream')
var uuid = require('hat')
var debug = require('debug')('level-rest')

module.exports = LevelREST

function LevelREST(db, options) {
  if (!(this instanceof LevelREST)) return new LevelREST(db, options)
  options = options || {}
  this.db = db
  this.options = options
  if (options.schema) this.validate = validator(options.schema)
  this.generateId = options.generateId || function() {
    return uuid()
  }.bind(this)
}

LevelREST.prototype.get = function(opts, cb) {
  var self = this
  if (!opts.id) return this.getAll(opts, cb)
  debug('get', opts)
  this.db.get(opts.id, opts, function(err, row) {
    if (err) return cb(err)
    row.id = opts.id
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
  var getStream = this.db.createReadStream(opts)
  getStream.on('error', cb)
  getStream.pipe(concat(function concatenator(rows) {
    rows = rows.map(function(row) {
      var data = row.value
      data.id = row.key
      return data
    })
    cb(null, {data: rows})
  }))
}

LevelREST.prototype.put = function(data, opts, cb) {
  var self = this
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
  if (!opts) opts = {}
  debug('put', data, opts)
  if (!this.validate(data)) {
    var errors = this.validate.errors
    return cb(null, {status: "error", errors: errors})
  }
  var id = opts.id
  delete opts.id
  
  // check if row already exists (for e.g. 200 or 201)
  this.db.get(id, opts, function(err, row) {
    var exists = !!row
    self.db.put(id, data, opts, function(err) {
      if (err) return cb(err)
      data.id = id
      cb(null, {created: !exists, data: data})
    })
  })
}

LevelREST.prototype.post = function(data, opts, cb) {
  if (typeof opts === 'function') {
    cb = opts
    opts = {}
  }
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
