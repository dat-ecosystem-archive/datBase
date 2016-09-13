const xtend = require('extend')
const serializeJS = require('serialize-javascript')

function page (url, contents, appState) {
  var dehydratedAppState = serializeJS(appState)

  function renderMetaTags () {
    var defaultMetadata = {
      title: 'Public Dataset',
      author: 'Dat Project',
      description: 'A public dataset shared with dat.'
    }
    var md = appState.archive && appState.archive.metadata ? appState.archive.metadata : {}
    md = xtend(defaultMetadata, md)
    return `<meta name="title" content="${md.title}" />
      <meta property="og:title" content="${md.title}" />
      <meta name="author" content="${md.author}" />
      <meta name="description" content="${md.description}" />
      <meta property="og:description" content="${md.description}" />
      <meta property="og:url" content="${url}" />`
  }

  return `<html>
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
        <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/intro.js/2.1.0/introjs.min.css"/>

        ${renderMetaTags()}
        <meta property="og:site_name" content="Dat Land" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="http://dat.land/public/img/dat-data-logo.svg" />
      </head>
      <body>
        <div id="app">
          <div id="browser-warning"></div>
          <div id="app-root">
            ${contents}
          </div>
        </div>
      </body>
      <script>
        window.dl = window.dl || {};
        window.dl.init__dehydratedAppState = ${dehydratedAppState};
      </script>
      <script type="text/javascript" src="public/js/browser-warning.js"></script>
      <script type="text/javascript" src="public/js/app.js"></script>
    </html>`
}

module.exports = page
