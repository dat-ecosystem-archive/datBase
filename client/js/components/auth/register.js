const html = require('choo/html')
const css = require('sheetify')
const form = require('get-form-data')

var prefix = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    form {
      width: 16rem;
      margin-left: auto;
      margin-right: auto;
    }
    label, input {
      width: 100%;
      text-transform: none;
    }
  }
`

const register = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    send('user:register', data)
    e.preventDefault()
    return false
  }

  return html`<div class="register ${prefix}">
    <div class="relative flex flex-column justify-center">
      <h3 class="f4">Create a New Account</h3>
      <form onsubmit=${onSubmit}>
        <div class="error">${state.error ? state.error.message : ''}</div>
        <p>
          <label for="username" class="dat-input dat-input--icon">
            <input name="username" type="text" placeholder="Username" class="dat-input__input dat-input__input--icon" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-happy-dat" />
            </svg>
          </label>
        </p>
        <p>
          <label for="email" class="dat-input dat-input--icon">
            <input name="email" type="email" placeholder="E-mail" class="dat-input__input dat-input__input--icon" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-letter" />
            </svg>
          </label>
        </p>
        <p>
          <label for="password" class="dat-input dat-input--icon">
            <input name="password" type="password" placeholder="Password" class="dat-input__input dat-input__input--icon" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-lock" />
            </svg>
          </label>
        </p>
        <p>
          <input type="submit" value="Register" class="w100 btn btn--green" />
        </p>
        <p class="f7">
          <a href="/login">Already Have an Account? Log In</a>
        </p>
      </form>
    </div>
  </div>`
}

module.exports = register
