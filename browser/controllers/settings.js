var dathubClient = require('../hub')

module.exports = function (data) {
  return {
    data: data,
    template: require('../templates/pages/settings.html'),
    onrender: function () {
      var ractive = this
      console.log(ractive.get('user'))
      ractive.on('submit', function (event) {
        dathubClient.users.update(ractive.get('user'), function (err, resp, json) {
          if (!err) {
            window.ractive.message('success', 'Profile updated successfully!')
          }
        })
        event.original.preventDefault()
      })
    }
  }
}
