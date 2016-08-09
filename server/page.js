function page (contents, dehydratedAppState) {
  return `<html>
      <head>
        <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
        <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
      </head>
      <body><div id="app-root">${contents}</div></body>
      <script>
        window.dl = window.dl || {};
        window.dl.init__dehydratedAppState = ${dehydratedAppState};
      </script>
      <script type="text/javascript" src="public/js/app.js"></script>
    </html>`
}

module.exports = page
