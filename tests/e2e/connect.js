var process = require('process')
var net = require('net')
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
        .expect.element('#share-link').text.matches(/^(.+)$/).before(10000)

      client.getText('#share-link', (result) => {
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
          .url(testServer + '#' + datlink)
          .waitForElementVisible('body', 10000)
      })
    }
  }

  testCases['found the other peer'] = (client) => {
    client
      .expect.element('#peers').text.matches(/2 Sources/).before(30000)
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
