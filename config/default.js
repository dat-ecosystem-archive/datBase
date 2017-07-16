module.exports = {
  data: 'data',
  admins: ['admins'],
  mixpanel: process.env.MIXPANEL || 'notakey',
  township: {
    secret: process.env.TOWNSHIP_SECRET || 'very very not secret',
    db: 'township.db'
  },
  email: {
    from: 'hi@example.com',
    smtpConfig: undefined
  },
  db: {
    dialect: 'sqlite3',
    connection: {
      filename: 'sqlite.db'
    },
    useNullAsDefault: true
  },
  whitelist: false,
  archiver: 'archiver'
}
