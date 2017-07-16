const html = require('choo/html')
const fourohfour = require('../../pages/fourohfour')
const header = require('../../components/header')

module.exports = function (state, emit) {
  console.log(state.township.profile)
  if (state.township.profile.role !== 'Admin') return fourohfour(state, emit)
  return html`
  <div>
  ${header(state, emit)}
    <div class="container">
      <h1>Hey ${state.township.username}. You're an admin. Cool!</h1>
      <h2>You can delete, edit, and add any user or dat on the site. With great power comes great responsibility!</h2>
      <p>This page is mostly here as a placeholder. It'd be cool if there were some ways to administrate the site here,
      including aggregate site statistics, uis for the api and archiver, and other fun stuff. Want to open a PR?</p>
    </div>
  </div>
`
}
