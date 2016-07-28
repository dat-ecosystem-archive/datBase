const serverRouter = require('server-router')
const router = serverRouter()
const app = require('app')

router.on('/', {
  get: function (req, res, params) {
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>hello world</h1></body></html>')
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
