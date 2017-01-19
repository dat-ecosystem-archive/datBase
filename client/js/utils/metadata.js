const collect = require('collect-stream')
// EXPERIMENTAL:
// right now we are reading this from dat.json but perhaps we
// will update this when we start using accounts and repos

module.exports = function (archive, cb) {
  var cancelled = false
  setTimeout(function () {
    if (cancelled) return
    cancelled = true
    return cb(new Error('no metadata'))
  }, 3000)
  collect(archive.createFileReadStream('dat.json'), (err, raw) => {
    if (cancelled) return
    cancelled = true
    if (err) return cb(err)
    done(raw, cb)
  })
}

function done (raw, cb) {
  var json
  try {
    json = JSON.parse(raw.toString())
  } catch (err) {
    return cb(err)
  }
  return cb(null, json)
}
