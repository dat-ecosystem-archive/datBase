var os = require('os')
var path = require('path')
var xtend = require('xtend')

var config = {
  shared: {
    township: {
      secret: 'very very not secret',
      db: path.join(__dirname, 'township.db'),
      email: {
        fromEmail: 'hi@example.com',
        postmarkAPIKey: 'your api key'
      },
      whitelist: false // otherwise path to whitelist email txt file
    },
    db: {
      dialect: 'pg',
      connection: process.env.PG_CONNECTION_STRING || 'postgres://datfolder:datfolder@localhost/datfolder',
      useNullAsDefault: true
    }
  },
  development: {},
  production: {
    township: {
      secret: process.env.TOWNSHIP_SECRET,
      db: path.join(os.homedir(), 'township.db'),
      whitelist: false
    },
    db: {
      connection: process.env.PG_CONNECTION_STRING
    }
  }
}

var env = process.env.NODE_ENV || 'development'
module.exports = xtend(config.shared, config[env])
