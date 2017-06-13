const response = require('response')
const auth = require('./auth')
const Users = require('./users')
const Dats = require('./dats')
const database = require('./database')

module.exports = function (config) {
  var db = database(config.db)
  const ship = auth(config, db)
  var users = Users(db.models.users)
  var dats = Dats(db.models.dats)

  return {
    db: db,
    users: api(users),
    dats: api(dats),
    auth: ship
  }

  function api (model) {
    return {
      get: done,
      post: done,
      put: done,
      delete: done
    }
    function done (req, res) {
      var route = model[req.method.toLowerCase()].bind(model)
      if (!route) return onerror(new Error('No ' + req.method + ' route.'), res)
      ship.currentUser(req, function (err, user) {
        if (err) return onerror(err, res)
        req.user = user
        route(req, function (err, data) {
          if (err) return onerror(err, res)
          return response.json(data).status(200).pipe(res)
        })
      })
    }
  }

  function onerror (err, res) {
    var data = {statusCode: 400, message: err.message}
    return response.json(data).status(400).pipe(res)
  }
}
