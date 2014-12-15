var $ = jQuery = require('jquery');

module.exports = function (selector) {
  var peeps = $(selector)
  for (var i = 0; i < peeps.length; i++) {
    var peep = peeps[i]
    var username = peep.getAttribute('data-user')
    if (!username) continue
    peep.setAttribute('style', "background-image: url('https://github.com/" + username + ".png')")
  }
}