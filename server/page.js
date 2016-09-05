function page (contents, dehydratedAppState) {
  return `<html>
      <head>
        <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
        <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/intro.js/2.1.0/introjs.min.css"/>
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
