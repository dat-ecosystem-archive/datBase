var streamsql = require('streamsql')

module.exports = function () {
  var db = streamsql.connect({
    driver: 'sqlite3',
    filename: ':memory:'
  })

  return {
    users: db.table('users', Users)
  }
}

var Users = {
  fields: [ 'id', 'nickname', 'email', 'hash', 'salt', 'verified' ]
}
