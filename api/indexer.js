var changesdown = require('changesdown')
var subleveldown = require('subleveldown')
var changes = require('changes-feed')
var changeProcessor = require('level-change-processor')
var indexer = require('level-indexer')
var runSeries = require('run-series')

module.exports = function(opts) {
  var indexers = {}
  
  Object.keys(opts.schema.properties).map(function(key) {
    var prop = opts.schema.properties[key]
    // only create indexers for properties marked
    // as 'index: true' in the schema
    if (!prop.index) return
    var indexDb = indexers[key] = indexer(opts.db, key, {
      map: function (key, cb) {
        opts.model.db.get(key, cb)
      }
    })

    var processor = changeProcessor({
      db: opts.state,
      feed: opts.feed,
      worker: worker,
      key: 'latest-' + key
    })
    
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
        reverseIndex.get(key, function(err, currentIndexKey) {
          if (err && !err.notFound) return cb(err)
          if (err && err.notFound) return cb()
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
        indexDb.add(val, key, function(err) {
          if (err) return cb(err)
          reverseIndex.put(key, index, cb)
        })
      }
    }
        
  })
  
  return indexers
}
