var path = require('path')

module.exports = {
  township: {
    secret: 'very secret code',
    db: path.join(__dirname, 'test-township.db')
  },
  db: {
    dialect: 'sqlite3',
    connection: { filename: path.join(__dirname, 'test-sqlite.db') },
    useNullAsDefault: true
  },
  townshipClient: {
    filepath: path.join(__dirname, '.townshiprc')
  },
  whitelist: path.join(__dirname, 'fixtures', 'whitelist.txt'),
  port: 8111
}
