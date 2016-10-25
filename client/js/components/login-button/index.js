'use strict'
const html = require('choo/html')
const button = require('./../../elements/button')

module.exports = function (props, prev, send) {
  if (props.profile) {
    return html`<div class="dat-button dat-button--login">
      ${button({
        text: `${props.user.username} Logout`,
        klass: 'btn btn--green btn__reveal-text',
        click: () => send('user:logout')
      })}`
  } else {
    return html`<div class="dat-button dat-button--login">
      ${button({
        text: 'Login',
        klass: 'btn btn--green btn__reveal-text',
        click: () => send('user:login')
      })}`
  }
}
