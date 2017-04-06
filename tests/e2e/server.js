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
      .url(testServer + '/install')
      .expect.element("input[name='import-dat']").value.to.equal('').before(2000)
    client
      .setValue("input[name='import-dat']", 'hello')
      .keys(client.Keys.ENTER)
      .expect.element('body').text.to.contain('No dat here.').before(2000)
  }
  testCases['viewing a dat with a key that doesnt exist gives 404'] = (client) => {
    // this is just a valid hash but doesn't resolve to a dat
    var notDat = 'e333a491c886867f9550afb6addf3bdad4204928af650412b988988d4c3b5fbc'
    client
      .url(testServer + '/install')
      .expect.element("input[name='import-dat']").value.to.equal('').before(2000)
    client
      .setValue("input[name='import-dat']", notDat)
      .keys(client.Keys.ENTER)
      .expect.element('body').text.to.contain('No sources found.').before(7000)
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
      client.end()
    })
  }
}
