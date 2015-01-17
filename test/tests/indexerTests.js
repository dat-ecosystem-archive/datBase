module.exports.storeBatch = function(test, common) {
  test('stores a batch', function(t) {
    common.getRegistry(t, function (err, api, done) {
      var batch = [
        {type: 'put', key: 'foo1k', value: 'foo1v'},
        {type: 'put', key: 'foo2k', value: 'foo2v'},
        {type: 'del', key: 'nope'}
      ]
      api.models.metadat.db.batch(batch, function(err) {
        t.ok(true)
        done()
      })
    })
  })
}

module.exports.all = function(test, common) {
  module.exports.storeBatch(test, common);
}