const html = require('choo/html')
const button = require('../elements/button')
const gravatar = require('../elements/gravatar')

module.exports = function (state, prev, send) {
  if (state.user.email) {
    return html`
      ${button({
        text: gravatar(state.user),
        click: () => send('user:sidePanel'),
        klass: 'btn'
      })}
    `
  } else {
    return html`
      ${button({
        text: 'Sign up',
        click: function () { window.location.href = '/register' },
        klass: 'btn btn--full btn--green'
      })}
    `
  }
}
