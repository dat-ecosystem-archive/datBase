const html = require('choo/html')
const css = require('sheetify')
const gravatar = require('./../../elements/gravatar')
const header = require('./../../components/header')
const list = require('./../../components/list')

module.exports = (state, prev, send) => {
  var username = state.profile.username
  var email = state.profile.email
  var name = state.profile.name
  var numDats = state.profile.dats.length
  var description = state.profile.description
  var pic = gravatar({email})
  state.profile.dats.map(function (dat) {
    dat.shortname = `${state.profile.username}/${dat.name}`
    return dat
  })
  var prefix = css`
    :host {
      display: flex;
      position: relative;
      .profile {
        width: 250px;
        background-color: var(--color-neutral-04);
      }
      .datasets {
        min-width: 200px;
        max-width: 800px;
        width: 100%;
      }

      @media screen and (max-width: 40rem) {
        display: block;
        .profile {
          width: 100%;
          display: block;
          align: items-center;
        }
      }
    }
  `

  return html`
    <div>
      ${header(state, prev, send)}
      <div class="${prefix}">
        <div class="profile pa4">
          <div class="name">
          <h2>${name}</h2>
          <h3>${username}</h3>
          <div class="pic">${pic}</div>
          </div>
          <h3 class="pt2 f5">
            ${description}
          </h3>
        </div>
        <div class="pa4 datasets">
          <h3>${username} has published ${numDats} dats</h3>
          ${list(state.profile.dats, send)}
        </div>
      </div>
    </div>`
}
