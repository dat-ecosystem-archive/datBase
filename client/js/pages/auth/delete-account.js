const html = require('choo/html')
const header = require('./../../components/header')
const form = require('get-form-data')

module.exports = (state, prev, send) => {
  function onsubmitConfirm (e) {
    e.preventDefault()
    var data = form(e.target)
    if (data.email !== state.township.email) send('message:error', 'Incorrect email.')
    else send('profile:delete', {id: state.township.profile.id})
    return false
  }

  return html`
    <div class="landing">
      ${header(state, prev, send)}
      <div class="mw5 pv5 center">
        <h3>Delete your account</h3>

        <p>If you want to delete your account, please enter your email below. **This cannot be undone**.</p>

        <form onsubmit=${onsubmitConfirm}>
          <p>
            <label for="email" class="dat-input dat-input--icon w-100">
              <input name="email" type="text" value='' placeholder="Email" class="dat-input__input dat-input__input--icon w-100" />
              <svg class="dat-input__icon">
                <use xlink:href="#daticon-letter" />
              </svg>
            </label>
          </p>

          <input type="submit" class="btn btn--full btn--red" value='Delete my account'>
        </form>
      </div>
  </div>`
}
