const html = require('choo/html')
const form = require('get-form-data')

const login = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    send('user:register', data)
    e.preventDefault()
    return false
  }

  return html`<div class="register">
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
          <input name="password" type="email" placeholder="Password" class="dat-input__input dat-input__input--icon" />
          <svg class="dat-input__icon">
            <use xlink:href="#daticon-lock" />
          </svg>
        </label>
      </p>
      <p>
        <input type="submit" value="Register" class="w100 btn btn--green" />
      </p>
    </form>
  </div>`
}

module.exports = login
