const html = require('choo/html')
const css = require('sheetify')
const button = require('../elements/button')
const gravatar = require('../elements/gravatar')

module.exports = function (state, prev, send) {
  return html``
  if (state.township.email) {
    var prefix = css`
      :host {
        img {
          width: 2em;
          height: 2em;
          display: block;
          vertical-align: middle;
          border-radius: 1rem;
        }
      }
  `
    return html`
      ${button({
        text: gravatar({email: state.township.email}),
        click: () => send('township:sidePanel'),
        klass: `btn ${prefix}`
      })}
    `
  } else {
    return html`
      ${button({
        text: 'Login',
        click: function () { window.location.href = '/login' },
        klass: 'btn btn--full btn--green'
      })}
    `
  }
}
