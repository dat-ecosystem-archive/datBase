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
      return html`
      <div>
        <div class="mw5 pv5 center">
          <h1 class="f4">Reset Your Password</h1>
          <p class="pa3 bg-yellow-disabled">
            ${state.user.passwordResetConfirmResponse}
          </p>
        </div>
      </div>`
    } else {
      return html`
      <div>
        <div class="mw5 pv5 center">
          <h1 class="f4">Reset Your Password</h1>
          <form action="" method="POST" id="password-reset-confirm-form" onsubmit=${onsubmitConfirm}>
            <p>
              <label for="newPassword" class="dat-input dat-input--icon">
                <input name="newPassword" type="password" placeholder="New password" class="dat-input__input dat-input__input--icon" />
                <svg class="dat-input__icon">
                  <use xlink:href="#daticon-lock" />
                </svg>
              </label>
            </p>
            <input type="submit" class="btn btn--green btn--full w-100" value="Reset your password">
          </form>
        </div>
      </div>`
    }
  } else {
    if (state.user.passwordResetResponse) {
      return html`
      <div>
        <div class="mw5 pv5 center">
          <h1 class="f4">Reset Your Password</h1>
          <p class="pa3 bg-yellow-disabled">
            ${state.user.passwordResetResponse}
          </p>
        </div>
      </div>`
    } else {
      return html`
      <div>
        <div class="mw5 pv5 center">
          <h1 class="f4">Reset Your Password</h1>
          <form action="" method="POST" id="password-reset-form" onsubmit=${onsubmitEmail}>
            <p>
              <label for="email" class="dat-input dat-input--icon w-100">
                <input name="email" type="email" placeholder="Your E-mail" class="dat-input__input dat-input__input--icon w-100" />
                <svg class="dat-input__icon">
                  <use xlink:href="#daticon-letter" />
                </svg>
              </label>
            </p>
            <input type="submit" class="btn btn--green btn--full w-100" value="Reset your password">
          </form>
        </div>
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
