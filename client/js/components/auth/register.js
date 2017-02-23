const html = require('choo/html')
const css = require('sheetify')
const form = require('get-form-data')

var prefix = css`
  :host {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: rgba(41,54,72,.8);
    .modal {
      min-width: 20rem;
      min-width: 25rem;
      padding: 2rem 2.5rem 2rem;
      background-color: white;
      box-shadow: 0 1.2rem 2.4rem rgba(0,0,0,.5);
    }
    form {
      width: 16rem;
      margin-left: auto;
      margin-right: auto;
    }
    label, input {
      width: 100%;
      text-transform: none;
    }
    .x {
      top: 0;
      right: 0;
      position: absolute;
      margin: 5px;
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

  return html`<div class="register ${state.user.register} ${prefix}">
    <div class="relative flex flex-column justify-center modal">
      <h3 class="f4">Register Your Dat Account</h3>
      <a class="x" onclick=${() => send('user:registerPanel', false)}>X</a>
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
