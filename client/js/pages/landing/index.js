const html = require('choo/html')

const landingPage = (state, prev, send) => {
  return html`
  <div class="landing">
    <div class="landing-main">
      <div class="landing-header">
        <img src="/public/img/dat-data-logo.svg" />
        <p>Share, version, and sync data on the distributed web.</p>
        <button href="https://github.com/datproject/dat-desktop">Download the Desktop App</button>
        <div class="row">
        <p><a href="https://datproject.org">About Dat</a> | <a href="https://github.com/datproject/dat">GitHub</a> | <a href="https://twitter.com/dat_project">Twitter</a> | <a href="http://tinyletter.com/datdata">Mailing List</a>
        </p>
      </div>
      </div>
    </div>
  </div>`
}

module.exports = landingPage
