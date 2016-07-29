const html = require('choo/html')
const header = require('./../../components/header')

const archivePage = (state, prev) => {
  return html`<html>
    <head>
      <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
      <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
    </head>
    <body>
      ${header(state, prev)}
      <div class="tmp-archive-view">
        <h1>ArchivePage</h1>
        <h2>Server-rendered archive key: ${state.archive.key}</h2>
      <script type="text/javascript" src="public/js/app.js"></script>
    </body></html>`
}

module.exports = archivePage
