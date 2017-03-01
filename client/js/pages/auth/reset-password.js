const html = require('choo/html')
const header = require('./../../components/header')
const form = require('get-form-data')

function body (state, prev, send) {
//  const authenticated = state.user.username
  const {accountKey, resetToken, email} = state.location ? state.location.search || {} : {}

  function onsubmitConfirm (e) {
    e.preventDefault()
    var data = form(e.target)
    data.accountKey = accountKey
    data.resetToken = resetToken
    data.email = email
    send('user:resetPasswordConfirmation', data)
  }

  function onsubmitEmail (e) {
    e.preventDefault()
    var data = form(e.target)
    send('user:resetPassword', data.email)
  }

  if (accountKey && resetToken) {
    if (state.user.passwordResetConfirmResponse) {
      return html`<div>
        <h2 class="f2 ttu dark-gray">Reset your password</h2>
        <p class="f3 pa3 bg-washed-yellow dib">${state.user.passwordResetConfirmResponse}</p>
      </div>`
    } else {
      return html`<div>
        <h2 class="f2 ttu dark-gray">Reset your password</h2>
        <form action="" method="POST" id="password-reset-confirm-form" onsubmit=${onsubmitConfirm}>
          <div class="mb3">
            <label class="tracked ttu f6 gray">
              <span>New password</span><br>
              <input type="password" class="pa2 w5 ba b--silver mt2" name="newPassword">
            </label>
          </div>
          <input type="submit" class="pa3 bg-light-gray hover-bg-gray hover-white pointer bn ba0"  value="Reset your password">
        </form>
      </div>`
    }
  } else {
    if (state.user.passwordResetResponse) {
      return html`<div>
        <h2 class="f2 ttu dark-gray">Reset your password</h2>
        <p class="f3 pa3 bg-washed-yellow dib">${state.user.passwordResetResponse}</p>
      </div>`
    } else {
      return html`<div>
        <h2 class="f2 ttu dark-gray">Reset your password</h2>
        <form action="" method="POST" id="password-reset-form" onsubmit=${onsubmitEmail}>
          <div class="mb3">
            <label class="tracked ttu f6 gray">
              <span>Your email</span><br>
              <input type="email" class="pa2 w5 ba b--silver mt2" name="email">
            </label>
          </div>
          <input type="submit" class="pa3 bg-light-gray hover-bg-gray hover-white pointer bn ba0" value="Reset your password">
        </form>
      </div>`
    }
  }
}

module.exports = (state, prev, send) => {
  if (!module.parent) {
    send('user:loginPanel', false)
  }

  return html`
    <div class="landing">
      ${header(state, prev, send)}
      ${body(state, prev, send)}
    </div>`
}
