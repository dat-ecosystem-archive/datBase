const html = require('choo/html')
const css = require('sheetify')
const form = require('get-form-data')

const login = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    send('user:login', data)
    e.preventDefault()
    return false
  }

  var prefix = css`
    :host {
      .x {
        top: 0;
        right: 0;
        position: absolute;
        margin: 5px;
      }
      form {
        text-align: center;
      }

      max-width: 600px;
      margin: auto;
      background-color: #F6F7F8;
    }
  `

  return html`<div class="login ${state.user.login} ${prefix}">
    <a class="x" onclick=${() => send('user:loginPanel', false)}>X</a>
    <form onsubmit=${onSubmit}>
      <h2 class="error">${state.error ? state.error.message : ''}</h2>
      <div class="dat-import">
        <div class="dat-import--icon">
          <img src="/public/img/link.svg" />
        </div>
        <input type="text" placeholder="E-mail" class="dat-import--input" name="email" />
      </div>
      <div class="dat-import">
        <div class="dat-import--icon">
          <img src="/public/img/link.svg" />
        </div>
        <input type="password" placeholder="Password" class="dat-import--input" name="password" />
      </div>
      <input type="submit" value="Login" class="btn btn--green btn__reveal-text" />
    </form>
  </div>`
}

module.exports = login
