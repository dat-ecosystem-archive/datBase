var levelRest = require('level-rest-parser')
var defaultSchema = require('./metadat.json')
var extend = require('extend')

module.exports = function(db, opts) {
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = defaultSchema

  var model = levelRest(db, opts)

  var metadat = {}
  extend(metadat, model) // inheritance

  metadat.authorize = function(params, userData, cb) {
    // if it doesnt have an id we dont need to do custom authorization
    if (!params.id) return cb(null, userData)

    // only allow users to edit their own data
    model.get({id: params.id}, function(err, meta) {
      // if not exists then skip authorization
      if (err) return cb(null, userData)
      // ensure only owner can edit
      if (meta.owner_id !== userData.user.handle) return cb(new Error('action not allowed'))
      else cb(null, userData)
    })
  }

  metadat.post = function (data, opts, cb) {
    var self = this
    self.indexes['owner_id'].find(data.owner_id, function (err, rows) {
      if (err) cb(err)
      if (rows.length > 0) {
        for (i in rows) {
          var row = rows[i]
          if (row.name == data.name) {
            return cb(null, {status: 'error', message: 'You have already published a dat with that name'})
          }
        }
      }
      model.post(data, opts, cb)
    })
  }

  return metadat
}