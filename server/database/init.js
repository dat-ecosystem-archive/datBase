const database = require('./')

module.exports = init

/**
 * Initializes the database.
 * @param  {[type]}   dbConfig  An opts object from config.db
 * @param  {Function} cb        When done, calls cb with (err, db)
 */
function init (dbConfig, cb) {
  var db = database(dbConfig)
  db.knex.schema.createTableIfNotExists('users', function (table) {
    table.uuid('id').primary()
    table.string('username')
    table.string('role')
    table.string('email')
    table.text('token')
    table.text('description')
  })
  .createTableIfNotExists('dats', function (table) {
    table.uuid('id').primary()
    table.uuid('user_id').references('users.id')
    table.string('name')
    table.string('hash')
    table.string('title')
    table.text('description')
    table.text('keywords')
  })
  .then(function () {
    cb(null, db)
  }).catch(function (err) {
    cb(err)
  })
}

if (!module.parent) {
  const defaultConfig = require('../../config')
  init(defaultConfig.db, function (err) {
    if (err) throw err
    console.log('Successfully created tables.')
    process.exit(0)
  })
}
