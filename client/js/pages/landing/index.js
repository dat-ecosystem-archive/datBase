const list = require('../../components/list')
const html = require('choo/html')

const landingPage = (state, emit) => {
  return html`
  <div class="landing">
    <div>
      ${list(state.explore.data, emit)}
    <div class="footer">
      <p><a href="https://datproject.org">About Dat</a> | <a href="https://github.com/datproject/dat">GitHub</a> | <a href="https://twitter.com/dat_project">Twitter</a> | <a href="http://tinyletter.com/datdata">Mailing List</a>
      </p>
    </div>
  </div>`
}

module.exports = landingPage
