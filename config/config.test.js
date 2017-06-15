var path = require('path')

module.exports = {
  data: path.join(__dirname, '..', 'tests'),
  db: {
    dialect: 'sqlite3',
    connection: {
      filename: 'test-api.sqlite'
    },
    useNullAsDefault: true
  },
  whitelist: false,
  port: process.env.PORT || 8888
}
