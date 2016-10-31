'use strict'
const html = require('choo/html')
const button = require('./../../elements/button')

module.exports = function (state, prev, send) {
  if (state.user.profile) {
    return html`<div class="dat-button dat-button--login">
      ${button({
        text: `${state.user.username} Logout`,
        klass: 'btn btn--green btn__reveal-text',
        click: () => send('user:logout')
      })}`
  } else {
    return html`
    <div class="dat-button dat-button--login">
      ${button({
        text: 'Login',
        klass: 'btn btn--green btn__reveal-text',
        click: () => send('user:login')
      })}`
  }
}
