var API = require('../api')

module.exports = function (PORT, cb) {
  API({
    db: ':memory:'
  }, function (err, server, close) {
    if (err) throw err
    server.listen(PORT, function (err) {
      if (err) throw err
      cb(null, server, close)
    })
  })
}
