var level = require('level')
var bytewise = require('bytewise/hex')

var config = require('../config.js')
var Users = require('./auth/users.js')
var db = level(config['DAT_REGISTRY_DB'],
  { keyEncoding: bytewise, valueEncoding: 'json' })

module.exports = {
  users: new Users(db)
}
