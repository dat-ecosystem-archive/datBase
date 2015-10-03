var changeProcessor = require('level-change-processor')
var changesdown = require('changesdown')
var debug = require('debug')('search-indexer')

module.exports = function (opts) {
  var writer = opts.searcher.createWriteStream()

  changeProcessor({
    db: opts.state,
    feed: opts.feed,
    worker: worker,
    key: 'latest-search-state'
  })

  function worker (change, cb) {
    if (!Buffer.isBuffer(change.value)) return cb(new Error(change.change + ' was not Buffer'))

    var decoded = changesdown.decode(change.value)

    if (decoded.key) var keyString = decoded.key.toString()

    if (decoded.value) var val = JSON.parse(decoded.value)

    if (decoded.type === 'put') {
      deleteCurrentIndex(keyString, function (err) {
        if (err) return cb(err)
        storeNewIndex(keyString, val, cb)
      })
    }

    if (decoded.type === 'del') {
      return deleteCurrentIndex(keyString, cb)
    }

    function deleteCurrentIndex (key, cb) {
      debug('search indexer deleting', key)
      var statement = 'DELETE FROM ' + opts.searcher.name + ' WHERE ' + 'id = ?'
      opts.searcher.db.run(statement, key, function (err) {
        if (err) return cb(err)
        cb()
      })
    }

    function storeNewIndex (key, value, cb) {
      debug('search indexer writing', key, value)
      value['id'] = key
      writer.write(value, function (err) {
        if (err) return cb(err)
        cb()
      })
    }
  }
}
