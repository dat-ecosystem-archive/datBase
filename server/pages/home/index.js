const html = require('choo/html')
const header = require('./../../components/header')

const homePage = (state, prev) => {
  return html`<html>
    <head>
      <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
      <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
    </head>
    <body>
      ${header(state, prev)}
      <div class="tmp-home-view">
        <h1>Home Page Test: </h1>
        <h2>${state.homePage.h1}</h2>
        <ul>
          <li>What is dat.land?</li>
          <li>How can I use it?</li>
          <li>What is dat's purpose in life?</li>
        </ul>
      </div>
    </body></html>`
}

module.exports = homePage
