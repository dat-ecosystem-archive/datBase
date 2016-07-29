const html = require('choo/html')

const homeView = (state, prev, send) => {
  return html`<div class="tmp-home-view">
      <h1>Home View Test: </h1>
      <h2>${state.homePage.h1}</h2>
      <ul>
        <li>What is dat.land?</li>
        <li>How can I use it?</li>
        <li>What is dat's purpose in life?</li>
      </ul>
    </div>`
}

module.exports = homeView
