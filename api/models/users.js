var util = require('util')
var concat = require('concat-stream')
var validator = require('is-my-json-valid')
var accountdown = require('accountdown')
var debug = require('debug')('users')
var defaultSchema = require('./users.json')

module.exports = Users

function Users(db, opts) {
  if (!(this instanceof Users)) return new Users(db, opts)
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = defaultSchema
  this.options = opts
  if (this.options.schema) this.validate = validator(this.options.schema)
  this.db = db
  this.accounts = accountdown(db)
}

Users.prototype.authorize = function(params, userData, cb) {
  // only allow users to edit their own data
  if (params.id) {
    if (params.id !== userData.user.handle) return cb(new Error('action not allowed'))
  }
  cb(null, userData)
}

Users.prototype.get = function(opts, cb) {
  var self = this
  if (!opts.id) return this.getAll(opts, cb)
  debug('get', opts)
  this.accounts.get(opts.id, function(err, row) {
    if (err) return cb(err)
    cb(null, row)
  })
}

Users.prototype.getAll = function(opts, cb) {
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
  getStream.pipe(concat(function concatenator(rows) {
    cb(null, {data: rows})
  }))
}

// set profile data for existing user
Users.prototype.put = function(data, opts, cb) {
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
  this.accounts.put(opts.id, data, function(err) {
    if (err) return cb(err)
    data.id = opts.id
    cb(null, {created: false, data: data})
  })
}

// do not allow POST for users
Users.prototype.post = function(data, opts, cb) {
  debug('post', opts)
  var err = new Error('creating users is not allowed')
  err.statusCode = 403
  setImmediate(function() {
    cb(err)
  })
}

Users.prototype.delete = function(opts, cb) {
  if (!opts) opts = {}
  debug('delete', opts)
  this.accounts.remove(opts.id, function(err) {
    if (err) return cb(err)
    cb()
  })
}

// function create(data, cb, insecure) {
//   // Creates a user given some data
//   //
//   // Parameters
//   // - data: object
//   //   expects handle, password
//   // - cb: function
//   //   callback when complete
//   // - insecure: boolean
//   //   This is for benchmarking without bcrypt hit
//   //   DO NOT USE FOR ANY OTHER PURPOSE
//   var self = this
//   debug("creating user", data)
//
//   if(!data['handle'] || !data['password']) {
//     return cb(new Error("can not create user without handle and password in data"), false)
//   }
//
//   var encryptPassword = function(password, cb) {
//     if (insecure) {
//       return cb(null, password)
//     }
//     else {
//       return bcrypt.hash(password, 10, cb)
//     }
//   }
//   encryptPassword(data['password'], function(err, pass) {
//     data['password'] = pass
//     data['createdTimestamp'] = new Date().getTime()
//     debug('posting user', data)
//     self.post(data, function(err, user) {
//       if (err) return cb(err)
//       // store secondary index manually TODO automate
//       self.byGithubId.put(user.githubId, user.id, function(err) {
//         if (err) return cb(err)
//         cb(null, user)
//       })
//     })
//   })
// }

// function login(id, password, cb) {
//   // pulled from level-userdb
//   // https://github.com/FrozenRidge/level-userdb/blob/master/db.js
//   var self = this
//   this.get(id, function(err, user) {
//     if (err || !user) return cb(new Error("could not find user"), false)
//       bcrypt.compare(password.toString(), user.password.toString(), function(err, res) {
//         if (err || !res) return cb(new Error("password mismatch"), false)
//         cb(null, user)
//       })
//   })
// }

// function restrictToSelf(req, res, id, cb) {
//   if (req.userid === id) {
//     cb(null)
//   }
//   else return cb(new Error('access denied'))
// }
//
// Users.prototype.deleteHandler = function(req, res, id, cb) {
//   var self = this
//   restrictToSelf(req, res, id, function (err) {
//     if (err) return cb(err)
//     RestModels.prototype.deleteHandler.call(self, req, res, id, cb)
//   })
// }
//
// Users.prototype.putHandler = function(req, res, id, cb) {
//   var self = this
//   restrictToSelf(req, res, id, function (err) {
//     if (err) return cb(err)
//     RestModels.prototype.putHandler.call(self, req, res, id, cb)
//   })
// }
//
// Users.prototype.postHandler = function(req, res, cb) {
//   return cb(new Error('You dont have permission to create users!!'))
// }