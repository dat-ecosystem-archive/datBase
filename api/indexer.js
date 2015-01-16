var indexer = require('level-indexer')

module.exports = function(db, schema) {
  
  var indexers = {}
  
  Object.keys(schema.properties).map(function(key) {
    var prop = schema.properties[key]
    // only create indexers for properties marked
    // as 'index: true' in the schema
    if (!prop.index) return
    indexers[key] = indexer(db, ['country'])
  })
  
  return indexers
}
