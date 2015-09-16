var dom = require('dom')

module.exports = function (selector) {
  var peeps = dom(selector)
  for (var i = 0; i < peeps.length; i++) {
    var peep = peeps[i]
    var username = peep.getAttribute('data-user')
    if (!username) continue
    peep.setAttribute('src', 'https://github.com/' + username + '.png')
  }
}