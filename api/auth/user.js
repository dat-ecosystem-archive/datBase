var db = require('level-userdb')()
var Model = require('level-orm')

module.exports = User

function Users(db) {
  // users is the sublevel name to user
  // handle is the primary key to user for insertion
  Models.call(this, { db: db }, 'users', 'handle');
}
util.inherits(Users, Models);

var users = new Users(db);

User.prototype.create = function(email, password) {
  db.addUser(username, password, metadata,
    function(err) {
      if (err) return console.log("error adding user: %s", err)
      console.log("ok")
    }
  )
}

User.prototype.login = function(username, password) {
  db.checkPassword(username, password, function(err, user) {
    if (err) return console.log("invalid password: %s", err)
    console.log("password ok")
  })
}

