var sqliteSearch = require('sqlite-search')
var through = require('through2')

module.exports = function (opts) {
  sqliteSearch({
    path: opts.path,
    columns: opts.columns,
  }, function(err, searcher) {
    if (err) return console.error('err', err)
    var writer = searcher.createWriteStream()
    //opts.reader.pipe(writer)
    writer.on('finish', function() {
      searcher.db.close()
    })
  })

}