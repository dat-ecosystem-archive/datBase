const postmarkTransport = require('nodemailer-postmark-transport')

var path = require('path')

module.exports = {
  mixpanel: process.env.MIXPANEL || path.join('secrets', 'mixpanel'),
  township: {
    db: 'datland-township.db',
    publicKey: path.join('secrets', 'ecdsa-p521-public.pem'),
    privateKey: path.join('secrets', 'ecdsa-p521-private.pem'),
    algorithm: 'ES512'
  },
  email: {
    fromEmail: 'noreply@datproject.org',
    transport: postmarkTransport(
      {
        auth: {apiKey: process.env.POSTMARK_KEY}
      })
  },
  db: {
    dialect: 'sqlite3',
    connection: {
      filename: 'datland-production.db'
    },
    useNullAsDefault: true
  },
  whitelist: false
}
