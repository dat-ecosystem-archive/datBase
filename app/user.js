var user = {}

user.currentUser = function(cb) {
  $.getJSON('/auth/currentuser', function (data) {
    if (data.status == 'success') {
      cb(null, data.user)
    }
    else {
      cb(data)
    }
  })
}

user.update = function (user, cb) {
 $.ajax({
    url: '/api/users/' + user.id,
    data: JSON.stringify(user),
    type: 'PUT',
    success: function (data, status) {
      if (data.status == 'error') {
        cb(new Error(data.message))
      }
      cb(new Error('test'))
    }
  });
}
module.exports = user
