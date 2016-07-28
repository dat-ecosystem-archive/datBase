const html = require('choo/html')

const homeView = (state, prev, send) => {
  return html`<div class="tmp-home-view"
        style="background: yellow; padding: 50px;">
      <h1>Home View: ${state.home.h1}</h1>
      <ul>
        <li>What is Dat.land?</li>
        <li>How can I use it?</li>
        <li>What is my purpose in life?</li>
      </ul>
    </div>`
}

module.exports = homeView
