var list = {
  'UNIQUE constraint failed: dats.name, dats.user_id': 'A dat already exists with that name on that account.'
}

module.exports = {
  list: list,
  humanize: function (err) {
    for (var msg in list) {
      if (err.message.indexOf(msg) > 0) {
        return new Error(list[msg])
      }
    }
    return err
  }
}
