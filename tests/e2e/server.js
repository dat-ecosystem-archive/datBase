var fs = require('fs')
var path = require('path')
var testServer = process.env.TEST_SERVER || 'https://datproject.org'

module.exports = new function () {
  var key = fs.readFileSync(path.join(__dirname, '..', 'key.txt')).toString()

  var testCases = this
  testCases['opening the browser and navigating to the url'] = (client) => {
    client
    .url(testServer)
    .assert.containsText('body', 'dat')
  }
  testCases['viewing a dat that doesnt exist gives 404'] = (client) => {
    client
    .url(testServer + '/list')
    .setValue("input[name='import-dat']", 'hello')
    client.keys(client.Keys.ENTER, function (done) {
      client.pause(1000)
      .assert.containsText('body', 'No dat here.')
    })
  }
  testCases['viewing a dat that exists with a dat.json'] = (client) => {
    client
    .setValue("input[name='import-dat']", key)
    client.keys(client.Keys.ENTER, function (done) {
      client
        .expect.element('#fs').text.to.contain('dat.json').before(5000)
      client
        .expect.element('#title').text.to.contain('hello world').before(5000)
      client
        .expect.element('#peers').text.to.contain('2').before(5000)
      client.end()
    })
  }
}
