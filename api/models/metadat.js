var levelRest = require('../level-rest.js')
var defaultSchema = require('./metadat.json')

module.exports = function(db, opts) {
  if (!opts) opts = {}
  if (!opts.schema) opts.schema = defaultSchema

  var model = levelRest(db, opts)

  return model
}