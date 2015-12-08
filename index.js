var API = require('./api')

var server = new API({
  db: './db'
})

var port = process.env.PORT || 8080
server.listen(port, function (err) {
  if (err) throw err
  console.log('listening on', port)
})
