var process = require('process')
var net = require('net')
var path = require('path')
var browser2

function makeServer () {
  var server = net.createServer((c) => {
    browser2 = c
  }).on('error', (err) => {
    throw err
  })
  server.listen({path: '/tmp/nightwatch-ipc.sock'}, () => {
  })
  return server
}

function makeClient () {
  var socket = net.connect({path: '/tmp/nightwatch-ipc.sock'}, () => {
    socket.on('data', (data) => {
    })
  }).on('error', () => {
    console.error('not connected')
  })
  return socket
}

module.exports = new function () {
  var ipcServer, ipcClient
  var firstClient = process.env.__NIGHTWATCH_ENV_KEY.match(/_1$/)
  var testServer = process.env.TEST_SERVER || 'https://dat.land'
  if (firstClient) {
    ipcServer = makeServer()
  } else {
    ipcClient = makeClient()
  }
  var testCases = this

  if (firstClient) {
    testCases.beforeEach = (browser, done) => {
      const check = () => {
        if (browser2) return done()
        setTimeout(check, 1000)
      }
      check()
    }

    testCases['opening the browser and navigating to the url'] = (client) => {
      client
        .url(testServer)
        .expect.element('.dat-button--new-dat button').to.be.present

      client
        .click('.dat-button--new-dat button').pause(1000)
        .expect.element('#title').text.matches(/^(.+)$/).before(10000)

      client.getText('#title', (result) => {
        console.log('sending', result.value)
        browser2.write(result.value)
      })
    }
  } else {
    testCases['opening the browser and navigating to the url'] = (client) => {
      client.pause(5000)
      ipcClient.once('data', (data) => {
        const datlink = data.toString()
        console.info('using datlink', datlink)
        client
          .url(testServer + datlink)
          .waitForElementVisible('body', 10000)
      })
    }
  }

  testCases['found the other peer'] = (client) => {
    client
      .expect.element('#peers').text.matches(/1 Source\(s\)/).before(30000)
  }

  if (firstClient) {
    testCases['upload file'] = (client) => {
      client.setValue('#add-files input[type=file]', path.join(__dirname, '..', 'fixtures', 'dat.json'))
        .expect.element('#fs').text.to.contain('dat.json').before(10000)
    }
    testCases['metadata rendered'] = client => {
      client.expect.element('#title').text.to.contain('hello world').before(1000)
      client.expect.element('#author').text.to.contain('joe bob').before(1000)
    }
  } else {
    testCases['file synced'] = (client) => {
      client
        .expect.element('#fs').text.to.contain('dat.json').before(10000)
    }
    testCases['metadata rendered'] = client => {
      client.expect.element('#title').text.to.contain('hello world').before(1000)
      client.expect.element('#author').text.to.contain('joe bob').before(1000)
    }
  }

  testCases.suspend = (client) => {
    client.pause(10000)
  }

  testCases.after = (client) => {
    if (ipcServer) {
      ipcServer.close()
    }
    if (ipcClient) {
      ipcClient.end()
    }
    client.end()
  }
}()
