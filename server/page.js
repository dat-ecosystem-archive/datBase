function page (contents) {
  return `<html>
      <head>
        <link rel="icon" type="image/png" href="public/img/dat-data-blank.png" />
        <link rel="stylesheet" type="text/css" href="public/css/main.css"/>
      </head>
      <body id="app-root">${contents}</body>
      <script type="text/javascript" src="public/js/app.js"></script>
    </html>`
}

module.exports = page
