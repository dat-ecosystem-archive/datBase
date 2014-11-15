module.exports = {
  load: function(ctx, next) {
    if (!ctx.data.user) {
      $.getJSON('/auth/currentuser', function (data, status) {
        if (data.status == 'success') {
          ctx.data.user = data.user;
        }
        else {
          ctx.data.user = null;
        }
        next();
      })
    }
  }
}

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