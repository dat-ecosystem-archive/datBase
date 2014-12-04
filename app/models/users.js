var request = require('../common/error-request.js')

module.exports.currentUser = function(cb) {
  var options = {
    uri: '/auth/currentuser',
    method: 'GET',
    json: true
  }

  request(options, function (err, resp, json) {
    cb(err, json.user)
  })
}

module.exports.get = function (handle, cb) {
  var options = {
    uri: '/api/users/' + handle,
    method: 'GET',
    json: true
  }
  request(options, function (err, resp, json) {
    return cb(err, json)
  })
}


module.exports.update = function (user, cb) {
  var options = {
    uri: '/api/users/' + user.handle,
    method: 'PUT',
    json: user
  }
  request(options, function (err, resp, json) {
    return cb(err)
  });
}
