function page (contents, metadata, dehydratedAppState) {
  return `<html>
      <head>
        <meta charset="utf-8" />
        <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
        <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/intro.js/2.1.0/introjs.min.css"/>
        <meta name="description" content="${metadata.description}" />
        <meta name="title" content="${metadata.title}" />
        <meta name="author" content="${metadata.author}" />
        <meta property="og:url" content="http://dat.land/${metadata.route}" />
        <meta property="og:site_name" content="Dat Land" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="${metadata.title}" />
        <meta property="og:description" content="${metadata.description}" />
        <meta property="og:image" content="http://dat.land/public/img/d.png" />
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
