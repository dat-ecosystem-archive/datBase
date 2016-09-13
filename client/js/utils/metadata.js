const collect = require('collect-stream')
// EXPERIMENTAL:
// right now we are reading this from dat.json but perhaps we
// will update this when we start using accounts and repos

module.exports = function (archive, cb) {
  collect(archive.createFileReadStream('dat.json'), (err, raw) => {
    if (err) {
      collect(archive.createFileReadStream('datapackage.json'), (err, raw) => {
        if (err) return cb(err)
        done(raw, cb)
      })
    } else done(raw, cb)
  })
}

function done (raw, cb) {
  console.log('metadata done! called')
  var json
  console.log('raw.toString():')
  console.log(raw.toString())
  try {
    json = JSON.parse(raw.toString())
  } catch (err) {
    console.log('hello 1a')
    console.log(err)
    return cb(err)
  }
  cb(null, json)
}
