var fs = require('fs')
var path = require('path')
var testServer = process.env.TEST_SERVER || 'https://datproject.org'
const os = require('os');
const modificatorKey = (os.type().toLowerCase() === 'darwin')
 ? 'COMMAND'
 : 'CONTROL'

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
    .url(testServer + '/install')
    .setValue("input[name='import-dat']", 'hello')
    client.keys(client.Keys.ENTER, function (done) {
      client.pause(2000)
      .assert.containsText('body', 'No dat here.')
    })
  }
  testCases['viewing a dat that exists with file list works'] = (client) => {
    client
    .setValue("input[name='import-dat']", key)
    client.keys(client.Keys.ENTER, function (done) {
      client.pause(2000)
      client
        .expect.element('#fs').text.to.contain('dat.json').before(5000)
      // client
      //   .expect.element('#peers').text.to.contain('1').before(5000)
      client.click('.directory')
      client.expect.element('#fs').text.to.contain('hello.txt').before(1000)
      client.expect.element('#title').text.to.contain('hello world').before(5000)
    })
  }
  testCases['copying link works'] = (client) => {
    client.click('a.clipboard')
    client.expect.element('.message.success').text.to.contain('Copied to clipboard').before(1000)
    client.expect.element("input[name='import-dat']").value.to.equal('')
  }
  testCases['pasting link works'] = (client) => {
    // somehow click to focus doesn't work unless we re-open browser
    client
      .url(testServer + '/install')
      .click("input[name='import-dat']")
      .keys([client.Keys[modificatorKey], 'v'])
      .expect.element("input[name='import-dat']").value.to.equal(key).before(3000)
    }
}
