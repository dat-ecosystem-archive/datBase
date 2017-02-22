const xtend = require('extend')
const svgSprite = require('dat-icons')
const serializeJS = require('serialize-javascript')

function page (url, contents, appState) {
  var dehydratedAppState = serializeJS(appState)

  function renderMetaTags () {
    var defaultMetadata = {
      title: 'Dat',
      author: 'Dat',
      description: 'Dat is the non-profit, secure, and distributed package manager for data.',
      image: 'https://datproject.org/public/img/dat-hexagon.svg'
    }
    var md = appState.archive && appState.archive.metadata ? appState.archive.metadata : {}
    md = xtend(defaultMetadata, md)
    return `<meta name="title" content="${md.title}" />
      <meta property="og:title" content="${md.title}" />
      <meta name="author" content="${md.author}" />
      <meta name="description" content="${md.description}" />
      <meta property="og:description" content="${md.description}" />
      <meta property="og:url" content="${url}" />
      <meta property="og:image" content="${md.image}" />`
  }

  return `<html>
      <head>
        <meta charset="utf-8" />
        <title>Dat</title>
        <link rel="stylesheet" type="text/css" href="/public/css/app.css"/>
        <link href="https://fonts.googleapis.com/css?family=Source+Code+Pro:400,500|Source+Sans+Pro:400,700" rel="stylesheet">
        <link rel="icon" href="/public/img/favicon.ico">
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
      ${svgSprite()}
      <script>
        window.dl = window.dl || {};
        window.dl.init__dehydratedAppState = ${dehydratedAppState};
      </script>
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-49664853-1', 'datproject.org');
        ga('send', 'pageview');
      </script>
      <script type="text/javascript" src="/public/js/browser-warning.js"></script>
      <script type="text/javascript" src="/public/js/app.js"></script>
    </html>`
}

module.exports = page
