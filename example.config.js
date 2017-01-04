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
      dialect: 'sqlite3'
      connection: {
        filename: './sqlite.db'
      }
      useNullAsDefault: true
    }
  },
  development: {},
  production: {
    township: {
      secret: process.env.TOWNSHIP_SECRET,
      db: path.join(os.homedir(), 'datland-township.db'),
      whitelist: false
    },
    db: {
      dialect: 'sqlite3'
      connection: {
        filename: path.join(os.homedir(), 'datland-production.db')
      }
      useNullAsDefault: true
    }
  }
}

var env = process.env.NODE_ENV || 'development'
module.exports = xtend(config.shared, config[env])
