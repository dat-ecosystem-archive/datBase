const css = require('sheetify')
const gravatar = require('../../elements/gravatar')
const html = require('choo/html')

const prefix = css`
  :host {
    position: fixed;
    right: .5rem;
    top: .5rem;
    z-index: 100;
    min-width: 16rem;
    padding: 1rem;
    background-color: var(--color-white);
    color: var(--color-neutral-80);
    box-shadow: 0 0 1rem rgba(0,0,0,.2);
    .gravatar {
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      display: block;
      margin: 0 .5rem 0 0;
      border: 2px solid var(--color-neutral-04);
    }

    .content {
      margin-top: .5rem;
      margin-bottom: .5rem;
      padding-top: .5rem;
      padding-bottom: .5rem;
      border-top: 1px solid var(--color-neutral-10);
      border-bottom: 1px solid var(--color-neutral-10);
    }
    .close-button {
      position: absolute;
      right: .5rem;
      top: .5rem;
      display: block;
      overflow: hidden;
      color: var(--color-neutral-20);
      &:hover, &:focus {
        color: var(--color-neutral-40);
      }
      svg {
        fill: currentColor;
        max-width: 1.5rem;
        max-height: 1.5rem;
      }
    }
    .dat-list {
      li {
        margin-top: .5rem;
        margin-bottom: .5rem;
      }
      .delete-btn {
        visibility: hidden;
      }
      &:hover, &:focus {
        .delete-btn {
          visibility: visible;
        }
      }
      svg {
        fill: currentColor;
        max-width: 1rem;
        max-height: 1.5rem;
      }
    }

  }
`

module.exports = function (state, prev, send) {
  if (!state.user.username) return

  function open (dat) {
    window.location.href = `/${state.user.username}/${dat.name}`
  }
  function remove (dat) {
    send('archive:delete', {id: dat.id})
  }
  return html`<div class="user-panel ${prefix} ${state.user.sidePanel}">
      <a class="close-button" title="Close" href="#" onclick=${() => send('user:sidePanel')}>
        <svg>
          <use xlink:href="#daticon-cross" />
        </svg>
      </a>
      <div class="flex items-center mb2">
        ${gravatar(state.user)}
        <div>
          ${state.user.email}
        </div>
      </div>
      <div class="content">
        <div>My Dats</div>
        <ul class="list-plain mb2 dat-list">
          ${state.user.dats.map(dat => {
            return html`
              <li>
                <a href="#" class="truncate color-neutral-40 hover-color-neutral-60" onclick=${() => open(dat)}>${dat.name}</a>
                <a href="#" class="fr color-neutral-20 hover-color-red delete-btn" onclick=${() => remove(dat)}>
                  <svg>
                    <use xlink:href="#daticon-delete" />
                  </svg>
                </a>
              </li>
            `
          })}
        </ul>
        <div>My Profile</div>
        <div>Account</div>
      </div>
      <div class="mb2">
        <button class="btn btn--large btn--green btn--full" onclick=${() => send('user:logout', {})}>LOGOUT</button>
      </div>
      <p class="f7 mb0 color-neutral-50 flex justify-between items-center">
        <span>
          Dat Project v${state.user.version}
        </span>
        <span>
          <a href="http://github.com/datproject/datproject.org/issues" target="_blank" class="color-neutral-50 hover-color-neutral-70">Report Bug</a>
          |
          <a href="http://github.com/datproject/datproject.org" target="_blank" class="color-neutral-50 hover-color-neutral-70">Contribute</a>
        </span>
      </p>
  </div>`
}
