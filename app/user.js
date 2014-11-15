var user = {}


user.get = function(cb) {
  $.getJSON('/auth/currentuser', function (data, status) {
    if (data.status == 'success') {
      cb(null, data.user)
    }
    else {
      cb(data.message)
    }
  })
}

module.exports = user

// Users.prototype.restrictToSelf = function(ctx, next) {
//   ctx.userid
//     if (err) {
//       return callback(err)
//     }
//     if (user && user.id === authedUser) {
//       return callback()
//     }
//     else {
//       render(req, res, './templates/splash.html', {message: {
//         'type': 'error',
//         'text': 'Silly cat, this dat is not for you.'
//       }})
//     }
//   })