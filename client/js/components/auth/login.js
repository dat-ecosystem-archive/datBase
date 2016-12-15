const html = require('choo/html')
const form = require('get-form-data')

const login = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    send('user:login', data)
    e.preventDefault()
  }

  return html`<div class="login">
    <form onsubmit=${onSubmit}>
      <input type="text" placeholder="E-mail" name="email" />
      <input type="text" placeholder="Password" name="password" />
      <input type="submit" value="Login" />
    </form>
  </div>`
}

module.exports = login
