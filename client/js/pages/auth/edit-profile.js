const html = require('choo/html')
const css = require('sheetify')
const form = require('get-form-data')
const header = require('./../../components/header')

module.exports = (state, prev, send) => {
  function onSubmit (e) {
    const data = form(e.target)
    data.id = state.township.profile.id
    send('profile:edit', data)
    return false
  }

  var prefix = css`
    :host {
      textarea { height: 100px; }
    }
  `
  var profile = state.township.profile
  return html`
    <div class="edit-profile ${prefix}">
      ${header(state, prev, send)}
      <div class="mw5 pv5 center">
        <h2>Edit your Profile</h2>
        <form onsubmit=${onSubmit}>
          <label for="name" class="dat-input dat-input--icon w-100">
            <input name="name" type="text" value=${profile.name || ''} placeholder="Full Name" class="dat-input__input dat-input__input--icon w-100" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-happy-dat" />
            </svg>
          </label>
          <label for="username" class="dat-input dat-input--icon w-100">
            <input name="username" type="text" value=${profile.username || ''} placeholder="Username" class="dat-input__input dat-input__input--icon w-100" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-file" />
            </svg>
          </label>
          <label for="email" class="dat-input dat-input--icon w-100">
            <input name="email" type="text" value=${profile.email || ''} placeholder="Email" class="dat-input__input dat-input__input--icon w-100" />
            <svg class="dat-input__icon">
              <use xlink:href="#daticon-letter" />
            </svg>
          </label>
          <label for="description" class="dat-input w-100">
            <textarea rows="4" name="description" placeholder="Description" class="dat-input__input w-100 pa2" >
              ${profile.description}
            </textarea>
          </label>
          <p class="flex items-center justify-between w-100">
            <a href="/reset-password" class="mr3">Change your password</a>
            <input type="submit" value="Save" class="w100 btn btn--green btn--full" />
          </p>
        </form>
      </div>
    </div>`
}
