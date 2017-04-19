const xtend = require('xtend')
const css = require('sheetify')
const html = require('choo/html')
const gravatar = require('gravatar')

module.exports = function (user, opts) {
  if (!user || !user.email) return html``
  if (!opts) opts = {}
  var _opts = xtend({s: '200', r: 'pg', d: '404'}, opts)
  var url = gravatar.url(user.email, _opts)
  var prefix = css`
    :host {
      border: 2px solid $color-neutral-40;
      background-color: $color-pink;
      margin: auto;
      &:hover, &:focus {
        border-color: $color-neutral-04;
      }
    }
  `
  return html`<img class="${prefix}" src="${url}" />`
}
