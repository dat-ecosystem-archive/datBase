const createMailer = require('township-email')
const createReset = require('township-reset-password-token')
const resetPasswordHTML = require('../mailers/resetPassword')

module.exports = function (config, townshipDb) {
  const townshipReset = createReset(townshipDb, {
    secret: config.township.secret
  })
  const mailer = createMailer(config.email)

  return {
    mail: mail,
    confirm: townshipReset.confirm
  }

  function mail (userEmail, accountKey, cb) {
    townshipReset.create({ accountKey: accountKey }, function (err, token) {
      if (err) return cb(new Error('problem creating reset token'))
      const clientHost = process.env.VIRTUAL_HOST
      ? `https://${process.env.VIRTUAL_HOST}`
      : 'http://localhost:8080'
      var reseturl = `${clientHost}/reset-password?accountKey=${accountKey}&resetToken=${token}&email=${userEmail}`

      var emailOptions = {
        to: userEmail,
        from: config.email.fromEmail,
        subject: 'Reset your password at datproject.org',
        html: resetPasswordHTML({reseturl: reseturl})
      }

      mailer.send(emailOptions, function (err, info) {
        if (err) return cb(err)
        if (config.email.transport.name === 'Mock') {
          console.log('mock email sent', emailOptions)
        }
        cb()
      })
    })
  }
}
