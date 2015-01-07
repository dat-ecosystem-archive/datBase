var levelRest = require('../level-rest.js')
var defaultSchema = require('./metadat.json')

module.exports = function(db, opts) {
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = defaultSchema

  var model = levelRest(db, opts)
    
  model.authorize = function(params, userData, cb) {
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

  return model
}