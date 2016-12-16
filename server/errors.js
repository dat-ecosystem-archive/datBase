var list = {
  'UNIQUE constraint failed: dats.name, dats.user_id': 'A dat already exists with that name on that account.',
  'UNIQUE constraint failed: users.username': 'A user already exists with that username.',
  'UNIQUE constraint failed: users.email': 'A user already exists with that email.',
  'Account not verified': 'Incorrect email and password.'
}

module.exports = {
  list: list,
  humanize: function (err) {
    for (var msg in list) {
      if (err.message.indexOf(msg) > -1) {
        return new Error(list[msg])
      }
    }
    return err
  }
}
