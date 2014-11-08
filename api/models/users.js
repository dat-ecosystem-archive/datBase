var RestModels = require('level-restful')
var util = require('util')
var uuid = require('uuid')
var bcrypt = require('bcrypt')
var debug = require('debug')('users')


module.exports = Users

function Users(db) {
  // users is the sublevel name to user
  // handle is the primary key to user for insertion
  fields = [
    {
      'name': 'handle',
      'type': 'string'
    },
    {
      'name': 'password',
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
  opts = {
    rest: false
  }
  RestModels.call(this, db, 'users', 'id', fields, opts);
}
util.inherits(Users, RestModels);
Users.prototype.keyfn = uuid.v1

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
    return cb("can not create user without handle and password in data", false)
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

Users.prototype.login = function(handle, password, cb) {
  // pulled from level-userdb
  // https://github.com/FrozenRidge/level-userdb/blob/master/db.js
  var self = this
  this.get(handle, function(err, user) {
    if (err || !user) return cb("could not find user", false)
      bcrypt.compare(password.toString(), user.password.toString(), function(err, res) {
        if (err || !res) return cb("password mismatch", false)
          cb(null, user)
      })
  })
}