const html = require('choo/html')
const button = require('../elements/button')
const gravatar = require('../elements/gravatar')

module.exports = function (state, prev, send) {
  var text, click
  if (state.user.email) {
    text = gravatar(state.user)
    click = () => send('user:sidePanel')
  } else {
    return ''
  }

  return html`
    ${button({
      text: text,
      click: click,
      klass: 'btn btn--green outline'
    })}
  `
}
