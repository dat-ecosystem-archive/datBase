var path = require('path')

module.exports = {
  township: {
    db: path.join(__dirname, 'test-township.db')
  },
  db: {
    dialect: 'sqlite3',
    connection: { filename: path.join(__dirname, 'test-sqlite.db') }
  },
  port: 8111
}
