var RestModels = require('level-restful')
var util = require('util')
var bcrypt = require('bcrypt')
var debug = require('debug')('users')
var jsonBody = require("body/json");

module.exports = Users

function Users(db) {
  // users is the sublevel name to user
  // handle is the primary key to user for insertion
  fields = [
    {
      'name': 'id',
      'type': 'number'
    },
    {
      'name': 'handle',
      'type': 'string'
    },
    {
      'name': 'email',
      'type': 'string',
      'optional': true
    },
    {
      'name': 'data',
      'type': 'object',
      'optional': true
    }
  ]
  opts = {}
  RestModels.call(this, db, 'users', 'id', fields, opts);
}
util.inherits(Users, RestModels);

Users.prototype.create = function(data, cb, insecure) {
  // Creates a user given some data
  //
  // Parameters
  // - data: object
  //   expects handle, password
  // - cb: function
  //   callback when complete
  // - insecure: boolean
  //   This is for benchmarking without bcrypt hit
  //   DO NOT USE FOR ANY OTHER PURPOSE
  var self = this
  debug("creating user", data);

  if(!data['handle'] || !data['password']) {
    return cb(new Error("can not create user without handle and password in data"), false)
  }

  var encryptPassword = function(password, cb) {
    if (insecure) {
      return cb(null, password)
    }
    else {
      return bcrypt.hash(password, 10, cb)
    }
  }
  encryptPassword(data['password'], function(err, pass) {
    data['password'] = pass
    data['createdTimestamp'] = new Date().getTime()
    self.save(data, cb)
  })
}

Users.prototype.login = function(id, password, cb) {
  // pulled from level-userdb
  // https://github.com/FrozenRidge/level-userdb/blob/master/db.js
  var self = this
  this.get(id, function(err, user) {
    if (err || !user) return cb(new Error("could not find user"), false)
      bcrypt.compare(password.toString(), user.password.toString(), function(err, res) {
        if (err || !res) return cb(new Error("password mismatch"), false)
        cb(null, user)
      })
  })
}

function restrictToSelf(req, res, id, cb) {
  if (req.userid === id) {
    cb(null)
  }
  else return cb(new Error('access denied'))
}

Users.prototype.deleteHandler = function(req, res, id, cb) {
  var self = this
  restrictToSelf(req, res, id, function (err) {
    if (err) return cb(err)
    RestModels.prototype.deleteHandler.call(self, req, res, id, cb)
  })
}

Users.prototype.putHandler = function(req, res, id, cb) {
  var self = this
  restrictToSelf(req, res, id, function (err) {
    if (err) return cb(err)
    RestModels.prototype.putHandler.call(self, req, res, id, cb)
  })
}

Users.prototype.postHandler = function(req, res, cb) {
  return cb(new Error('You dont have permission to create users!!'))
}