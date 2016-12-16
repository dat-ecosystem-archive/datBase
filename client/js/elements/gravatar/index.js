const html = require('choo/html')
const gravatar = require('gravatar')

module.exports = function (user) {
  if (!user || !user.email) return html``
  var url = gravatar.url(user.email, {s: '200', r: 'pg', d: '404'})
  return html`<img class="gravatar" src="${url}" />`
}
