var level = require('level')
var RestModels = require('level-restful')
var bytewise = require('bytewise/hex')
var util = require('util')
var debug = require('debug')('models')
var timestamp = require('monotonic-timestamp')

var defaults = require('./defaults.js')
var Users = require('./auth/users.js')

// TODO pass in overrides
module.exports = function() {
  var db = level(defaults['DAT_REGISTRY_DB'],
    { keyEncoding: bytewise, valueEncoding: 'json' })

  return {
    db: db,
    users: new Users(db),
    metadat: new MetaDat(db)
  }
}

function MetaDat(db) {
  // MetaDat is the metadata for a particular dat instance.
  // id is the primary key, auto incremented by timestamp
  fields = [
    {
      'name': 'owner_id',
      'type': 'number'
    },
    {
      'name': 'name',
      'type': 'string'
    },
    {
      'name': 'url',
      'type': 'string'
    },
    {
      'name': 'schema',
      'type': 'string',
      'optional': true
    },
    {
      'name': 'license',
      'type': 'string',
      'optional': true,
      'default': 'BSD'
    }
  ]
  RestModels.call(this, db, 'metadat', 'id', fields, opts);
}

util.inherits(MetaDat, RestModels);
MetaDat.prototype.keyfn = timestamp
