var API = require('./api')

API({
  db: ':memory:'
}, function (err, server) {
  if (err) throw err
  var port = process.env.PORT || 8080
  server.listen(port, function (err) {
    if (err) throw err
    console.log('listening on', port)
  })
})
