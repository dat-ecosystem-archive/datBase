var os = require('os')
var path = require('path')
var xtend = require('xtend')

var config = {
  shared: {
    secret: 'very very not secret',
    db: path.join(__dirname, 'township.db'),
    email: {
      fromEmail: 'hi@example.com',
      postmarkAPIKey: 'your api key'
    }
  },
  development: {},
  production: {
    secret: process.env.TOWNSHIP_SECRET,
    db: path.join(os.homedir(), 'township.db')
  }
}

var env = process.env.NODE_ENV || 'development'
module.exports = xtend(config.shared, config[env])
