module.exports = function Queries (knex, models) {
  return {
    getDatByShortname: function (params, cb) {
      models.users.get({username: params.username}, function (err, results) {
        if (err) return cb(err)
        if (!results.length) return cb(new Error('Username not found.'))
        var user = results[0]
        models.dats.get({user_id: user.id, name: params.dataset}, function (err, results) {
          if (err) return cb(err)
          if (!results.length) return cb(new Error('Dat with that name not found.'))
          var dat = results[0]
          return cb(null, dat)
        })
      })
    },
    datList: function (params, cb) {
      knex.raw('SELECT users.username, dats.id, dats.name, dats.created_at from dats inner join users on dats.user_id=users.id')
      .then(function (resp) {
        cb(null, resp)
      })
      .catch(cb)
    }
  }
}
