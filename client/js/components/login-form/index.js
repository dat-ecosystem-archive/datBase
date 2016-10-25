const html = require('choo/html')

module.exports = function (props, prev, send) {
  function onSubmit (e) {
    const username = e.target.children[0]
    const password = e.target.children[1]
    send('user:login', { username: username.value, password: password.value })
    username.value = ''
    password.value = ''
    e.preventDefault()
  }
  return html`
    <div class="login-button">
      <form onsubmit=${onSubmit}>
        <input type="text" placeholder="Username" id="username" />
        <input type="password" placeholder="Password" id="password" />
        <input type="submit" value="Submit" />
      </form>
    </div>
  `
}
