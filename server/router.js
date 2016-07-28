const serverRouter = require('server-router')
const router = serverRouter()
const app = require('./app')


router.on('/', {
  get: function (req, res, params) {
    res.setHeader('Content-Type', 'text/html');
    const body = app.toString('/', app.state)
    // TODO: send app state down the pipe?
    res.end('<html><body>' + body + '</body></html>')
  }
})

router.on('/:archiveId', {
  get: function (req, res, params) {
    res.setHeader('Content-Type', 'text/html');
    res.end('route is: /' + params.archiveId)
  }
})

router.on('/:archiveId/:filePath', {
  get: function (req, res, params) {
    res.end('route is: /' + params.archiveId + '/' + params.filePath)
  }
})


module.exports = router
