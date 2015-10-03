module.exports = function ensurePermissions (server, req, res, opts, cb) {
  var method = req.method.toLowerCase()

  // check the session
  server.sessions.getSession(req, function (sessionErr, session) {
    if (sessionErr) {
      if (method !== 'get') return cb(new Error('action not allowed'))
      else return cb(null, {}) // let GETs through even if logged out
    }
    // get profile
    server.models.users.get({id: session.data.id}, function (profileErr, profile) {
      var userData = {session: session, user: profile}

      // let GETs through
      if (method === 'get') return cb(null, userData)

      // otherwise require account for access
      if (profileErr) return cb(new Error('action not allowed'))

      // check if model has specific authorization rules and use those
      var model = server.models[opts.params.model]
      opts.serverOpts = server.options
      if (model && model.authorize) return model.authorize(opts, userData, cb)

      // otherwise return the userData
      return cb(null, userData)
    })
  })
}
