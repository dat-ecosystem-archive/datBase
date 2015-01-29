var changesdown = require('changesdown')
var subleveldown = require('subleveldown')
var changes = require('changes-feed')
var changeProcessor = require('level-change-processor')
var indexer = require('level-indexer')
var runSeries = require('run-series')

// high level description:
// when data is stored in a model,
// for every property in that model's schema that needs indexing,
// store two indexes,
// a secondary index with key=property and value=primaryKey,
// a reverse index with key=primaryKey and value=property.

module.exports = function(opts) {
  var indexers = {}
  
  Object.keys(opts.schema.properties).map(function(key) {
    var prop = opts.schema.properties[key]
    // only create indexers for properties marked
    // as 'index: true' in the schema
    if (!prop.index) return
      
    // the custom map function here fetches the entire row
    // because only the key is stored in the index
    var indexDb = indexers[key] = indexer(opts.db, key, {
      map: function (key, cb) {
        opts.model.db.get(key, cb)
      }
    })

    // listen to changes on the model
    var processor = changeProcessor({
      db: opts.state, // db to store change processor state in
      feed: opts.feed,
      worker: worker,
      key: 'latest-' + key // prefix because all processors share one state db
    })
    
    // used to check if we have an index for a key
    var reverseIndex = subleveldown(opts.db, 'reverse-' + key)
    
    function worker(change, cb) {
      if (!Buffer.isBuffer(change.value)) return cb(new Error(change.change + ' was not Buffer'))

      var decoded = changesdown.decode(change.value)

      if (decoded.key) {
        var keyString = decoded.key.toString()
      }

      if (decoded.value) {
        var val = JSON.parse(decoded.value)
        var newIndexKey = indexDb.key(val, keyString)
      }
        
      if (decoded.type === 'put') {
        deleteCurrentIndex(keyString, function(err) {
          if (err) return cb(err)
          storeNewIndex(keyString, val, newIndexKey, cb)
        })
      }
      
      if (decoded.type === 'del') {
        return deleteCurrentIndex(keyString, cb)
      }
      
      if (decoded.type === 'batch') {
        var fns = decoded.batch.map(function(obj) {
          var batchKey = obj.key.toString()
          if (obj.type === 'put') {
            var batchVal = JSON.parse(obj.value)
            var newBatchKey = indexDb.key(batchVal, batchKey)
            return function task(done) {
              deleteCurrentIndex(batchKey, function(err) {
                if (err) return done(err)
                storeNewIndex(batchKey, batchVal, newBatchKey, done)
              })
            }
          }
          
          if (obj.type === 'del') {
            return function task(done) {
              deleteCurrentIndex(batchKey, done)
            }
          }
        })
        
        runSeries(fns, cb)
      }
      
      function deleteCurrentIndex(key, cb) {
        // first check if we have an index for this key
        reverseIndex.get(key, function(err, currentIndexKey) {
          if (err && !err.notFound) return cb(err)
          // if not we can skip the rest of this function
          if (err && err.notFound) return cb()
          // if we do then we have to delete both our index and our reverse index
          opts.db.del(currentIndexKey, function(err) {
            if (err) return cb(err)
            reverseIndex.del(key, function(err) {
              if (err) return cb(err)
              cb()
            })
          })
        })
      }
      
      function storeNewIndex(key, val, index, cb) {
        // store our index (keyed by `val`) and our reverse index (keyed by `key`)
        indexDb.add(val, key, function(err) {
          if (err) return cb(err)
          reverseIndex.put(key, index, cb)
        })
      }
    }
        
  })
  
  return indexers
}
