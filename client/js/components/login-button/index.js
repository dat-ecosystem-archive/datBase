const html = require('choo/html')
const button = require('../../elements/button')
const gravatar = require('../../elements/gravatar')

module.exports = function (state, prev, send) {
  if (state.user.email) return gravatar(state.user)
  return html`
    ${button({
      text: 'Login',
      click: () => send('user:showLogin', {})
    })}
  `
}
