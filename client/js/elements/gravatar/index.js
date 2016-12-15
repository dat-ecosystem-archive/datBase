const html = require('choo/html')
const gravatar = require('gravatar')

module.exports = function (user) {
  if (!user || !user.email) return html``
  var url = gravatar.url(user.email, {s: '200', r: 'pg', d: '404'})
  return html`<div class="gravatar"><img src="${url}" /></div>`
}
