const html = require('choo/html')
const button = require('../button')
const gravatar = require('../gravatar')

module.exports = function (state, prev, send) {
  console.log(state.user)
  if (state.user.email) return gravatar(state.user)
  return html`
    ${button({
      text: 'Login',
      click: () => send('user:showLogin', {})
    })}
  `
}
