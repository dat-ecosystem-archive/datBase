module.exports.storeBatch = function (test, common) {
  test('stores a batch', function (t) {
    common.getRegistry(t, function (err, api, done) {
      var batch = [
        {type: 'put', key: 'foo1k', value: 'foo1v'},
        {type: 'put', key: 'foo2k', value: 'foo2v'},
        {type: 'del', key: 'nope'}
      ]
      api.models.metadat.db.batch(batch, function (err) {
        if (err) t.ifErr(err)
        t.ok(true, 'did not crash')
        done()
      })
    })
  })
}

module.exports.all = function (test, common) {
  module.exports.storeBatch(test, common)
}
