const html = require('choo/html')
const form = require('get-form-data')

const login = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    send('user:login', data)
    e.preventDefault()
    return false
  }

  return html`<div class="login">
    <form onsubmit=${onSubmit}>
      <h3 class="error">${state.error ? state.error.message : ''}</h3>
      <input type="text" placeholder="E-mail" name="email" />
      <input type="text" placeholder="Password" name="password" />
      <input type="submit" value="Login" />
    </form>
  </div>`
}

module.exports = login
