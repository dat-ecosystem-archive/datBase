const database = require('./')

module.exports = init

function init (config, cb) {
  var db = database(config)
  db.knex.schema.createTableIfNotExists('users', function (table) {
    table.uuid('id').primary()
    table.string('username')
    table.string('email')
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
  init(defaultConfig, function (err) {
    if (err) throw err
    console.log('Successfully created tables.')
    process.exit(0)
  })
}
