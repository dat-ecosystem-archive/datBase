const collect = require('collect-stream')

module.exports = function (archive, cb) {
  collect(archive.createFileReadStream('dat.json'), (err, raw) => {
    if (err) {
      archive.createFileReadStream('datapackage.json', (err, raw) => {
        if (err) return cb(err)
        done(raw, cb)
      })
    }
    else done(raw, cb)
  })
}

function done (raw, cb) {
  var json
  try {
    json = JSON.parse(raw.toString())
  } catch (err) {
    return cb(err)
    json = {}
  }
  cb(null, json)
}
