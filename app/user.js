var user = {}

user.get = function(cb) {
  $.getJSON('/auth/currentuser', function (data) {
    if (data.status == 'success') {
      cb(null, data.user)
    }
    else {
      cb(data)
    }
  })
}
module.exports = user
