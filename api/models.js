var level = require('level')
var bytewise = require('bytewise/hex')

var defaults = require('./defaults.js')
var Users = require('./auth/users.js')

// TODO pass in overrides
module.exports = function() {
  var db = level(defaults['DAT_REGISTRY_DB'],
    { keyEncoding: bytewise, valueEncoding: 'json' })
  
  return {
    users: new Users(db)
  }
}