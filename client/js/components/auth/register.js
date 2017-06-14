const html = require('choo/html')
const form = require('get-form-data')

const register = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    send('township:register', data)
    e.preventDefault()
    return false
  }

  return html`<div class="register">
    <div class="mw5 pv6 center">
      <h1 class="f4">Create a New Account</h1>
      <form onsubmit=${onSubmit}>
        <div class="error">${state.township.error}</div>
        <p>
          <label for="username" class="dat-input dat-input--icon w-100">
            <input name="username" type="text" placeholder="Username" class="dat-input__input dat-input__input--icon w-100" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-happy-dat" />
            </svg>
          </label>
        </p>
        <p>
          <label for="email" class="dat-input dat-input--icon w-100">
            <input name="email" type="email" placeholder="E-mail" class="dat-input__input dat-input__input--icon w-100" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-letter" />
            </svg>
          </label>
        </p>
        <p>
          <label for="password" class="dat-input dat-input--icon w-100">
            <input name="password" type="password" placeholder="Password" class="dat-input__input dat-input__input--icon w-100" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-lock" />
            </svg>
          </label>
        </p>
        <p>
          <input type="submit" value="Register" class="btn btn--green btn--full w-100" />
        </p>
        <p class="f7">
          <a href="/login">Already Have an Account? Log In »</a>
        </p>
      </form>
    </div>
  </div>`
}

module.exports = register
