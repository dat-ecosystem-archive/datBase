const html = require('choo/html')
const css = require('sheetify')
const gravatar = require('./../../elements/gravatar')
const header = require('./../../components/header')
const list = require('./../../components/list')

var profileStyles = css`
  :host {
    min-height: calc(100vh - 4rem);
  }
`

var avatarStyles = css`
  :host {
    display: block;
    margin: 0 auto;
    height: auto;
    box-shadow: 0 0 1.5rem rgba(0,0,0,.15);
  }
`

module.exports = (state, prev, send) => {
  var username = state.profile.username
  var email = state.profile.email
  var name = state.profile.name
  var numDats = state.profile.dats.length
  var description = state.profile.description
  var pic = gravatar({email}, {}, avatarStyles)
  state.profile.dats.map(function (dat) {
    dat.shortname = `${state.profile.username}/${dat.name}`
    return dat
  })

  return html`
    <div>
      ${header(state, prev, send)}
      <div class="flex flex-column flex-row-m flex-row-l ${profileStyles}">
        <div class="bg-neutral-04 pa4 tc tl-m tl-l">
          <div class="name">
            <h1 class="f4 mb1">${name}</h1>
            <h2 class="f5 color-neutral-80">${username}</h2>
            ${pic}
          </div>
          <h3 class="pt2 f5">
            ${description}
          </h3>
        </div>
        <div class="pa4 flex-auto">
          <h3 class="f5">
            ${username} has published ${numDats} dats
          </h3>
          ${list(state.profile.dats, send)}
        </div>
      </div>
    </div>`
}
