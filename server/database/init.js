const database = require('./')
module.exports = init

/**
 * Initializes the database.
 * @param  {[type]}   dbConfig  An opts object from config.db
 * @param  {Function} cb        When done, calls cb with (err, db)
 */
function init (dbConfig, cb) {
  var db = database(dbConfig)
  var creator = db.knex.schema
  var check = db.knex.schema
  db.knex.schema.hasTable('users').then(function (exists) {
    if (!exists) {
      return db.knex.schema.createTable('users', function (table) {
        table.uuid('id').primary()
        table.string('username').unique()
        table.string('email').unique()
        table.string('role')
        table.text('token')
        table.text('description')
        table.timestamp('created_at').defaultTo(db.knex.fn.now())
        table.timestamp('updated_at')
      })
    }
  })
  db.knex.schema.hasTable('dats').then(function (exists) {
    if (!exists) {
      return db.knex.schema.createTable('dats', function (table) {
        table.uuid('id').primary()
        table.uuid('user_id').references('users.id')
        table.string('name')
        table.string('url')
        table.string('title')
        table.text('description')
        table.text('keywords')
        table.timestamp('created_at').defaultTo(db.knex.fn.now())
        table.timestamp('updated_at')
        table.unique(['name', 'user_id'])
      })
    }
  }).then(function () {
    cb(null, db)
  }).catch(function (err) {
    cb(err)
  })
}

if (!module.parent) {
  var dbPath = process.argv.slice(2)[0]
  var dbConfig = {}
  if (dbPath) {
    dbConfig = {
      dialect: 'sqlite3',
      connection: {
        filename: dbPath
      },
      useNullAsDefault: true
    }
  } else {
    const defaultConfig = require('../../config')
    dbConfig = defaultConfig.db
  }
  init(dbConfig, function (err) {
    if (err) throw err
    console.log('Successfully created tables.')
    process.exit(0)
  })
}
