var streamsql = require('streamsql')

module.exports = function (opts) {
  var db = streamsql.connect({
    driver: 'sqlite3',
    filename: opts.db
  })

  return {
    users: db.table('users', Users)
  }
}

var Users = {
  fields: [ 'id', 'nickname', 'email', 'hash', 'salt', 'verified' ]
}
