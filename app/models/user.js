var request = require('xhr')

module.exports.currentUser = function(cb) {
  var options = {
    uri: '/auth/currentuser',
    method: 'GET',
    json: true
  }

  request(options, function (err, resp, json) {
    if (err) return cb(err)
    if (json.status == 'success') {
      cb(null, json.user)
    }
    else {
      cb(json)
    }
  })
}

module.exports.update = function (user, cb) {
  var options = {
    uri: '/api/users/' + user.handle,
    method: 'PUT',
    json: user
  }
  request(options, function (err, resp, json) {
    if (err) return cb(err)
    if (json.status == 'error') {
      return cb(new Error(json.message))
    }
    return cb(null)
  });
}
