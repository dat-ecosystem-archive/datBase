const css = require('sheetify')
const gravatar = require('../../elements/gravatar')
const html = require('choo/html')

module.exports = function (state, prev, send) {
  if (!state.user.username) return
  const prefix = css`
    :host {
      position: fixed;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      min-width: 250px;

      .top-part {
        background-color: var(--color-blue);
        position: relative;
        padding: 0.8rem 1.75rem 1rem;
        color: var(--color-neutral-20);
        text-align: center;
        font-size: 0.8rem;
        font-weight: 300;
      }

      .close {
        position: absolute;
        right: 10px;
        top: 10px;
        width: 20px;
        height: 20px;
        overflow: hidden;
        &:hover {
          &::before, &::after {
            background: var(--color-green);
          }
        }

        &::before, &::after {
          content: '';
          position: absolute;
          width: 100%;
          top: 50%;
          left: 0;
          height: 2px;
          margin-top: -1px;
          background: var(--color-neutral-20);
        }
        &::before {
          transform: rotate(45deg);
        }
        &::after {
          transform: rotate(-45deg);
        }
      }

      .gravatar {
        border-radius: 65px;
        width: 65px;
        margin: 0.5rem auto 1rem;
        display: block;
        border: 2px solid var(--color-neutral-04);
      }

      .body-part {
        margin:0;
        padding: 1rem 1.75rem;
        background-color: var(--color-neutral-04);
        box-shadow: -4px 0 10px -2px var(--color-neutral-04);
      }

      .content {
        height:100%;
        color: var(--color-neutral-80);
        font-weight: bold;
        font-size: 1rem;

        a.delete-btn {
          color: red;
          float: right;
          display: none;
        }
        a {
          color: var(--color-neutral-80);
          &:hover {
            color: var(--color-neutral-40);
          }
        }
        li {
          margin:1.5rem 0;
        }
        li:hover {
          a.delete-btn { display: block; }
        }
      }

      .footer-part {
        position: absolute;
        bottom: 1rem;
        width: 100%;
        background-color: --color-neutral-04;
        color: var(--color-neutral-50);
        font-size: 0.7rem;

        .btn {
          margin-bottom: 0.75rem;
        }

        p {
          margin: 0;
          a:not(:first-child) {
            padding-right: 5px;
            padding-left: 5px;
          }
          a:first-child {
            padding-right:5px;
          }
        }
      }

    }
  `
  function open (dat) {
    window.location.href = `/${state.user.username}/${dat.name}`
  }
  function remove (dat) {
    send('archive:delete', {id: dat.id})
  }
  return html`<div class="user-panel ${prefix} ${state.user.sidePanel}">
    <div class="top-part">
      <a class="close" href="#" onclick=${() => send('user:sidePanel')}></a>
      ${gravatar(state.user)}
      ${state.user.email}
    </div>
    <div class="body-part">
      <div class="content">
        <ul>
          <h4>My Dats</h4>
          ${state.user.dats.map(dat => {
            return html`
              <li>
                <a href="#" onclick=${() => open(dat)}>${dat.name}</a>
                <a href="#" class="delete-btn" onclick=${() => remove(dat)}>X</a>
              </li>
            `
          })}
        </ul>
      </div>
      <div class="footer-part">
        <button class="btn btn--large btn--green btn--full" onclick=${() => send('user:logout', {})}>LOGOUT</button>
        <p>Dat Project v${state.user.version}</p>
        <p><span><a href="http://github.com/datproject/datfolder/issues" target="_blank">Report Bug</a> |
        <a href="http://github.com/datproject/datfolder" target="_blank">Contribute</a></span></p>
      </div>
    </div>
  </div>`
}
