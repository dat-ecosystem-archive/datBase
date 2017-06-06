module.exports = {
  data: 'data',
  mixpanel: process.env.MIXPANEL || 'notakey',
  township: {
    secret: process.env.TOWNSHIP_SECRET || 'very very not secret',
    db: 'township.db'
  },
  email: {
    fromEmail: 'hi@example.com'
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
