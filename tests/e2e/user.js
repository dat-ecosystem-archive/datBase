var testServer = process.env.TEST_SERVER || 'https://datproject.org'

module.exports = new function () {
  var testCases = this
  testCases['Registration require email in whitelist'] = (client) => {
    client
      .url(testServer + '/register')
      .assert.containsText('body', 'Register Your Dat Account')

    client
      .setValue(".register form input[name='username']", 'testuser')
      .setValue(".register form input[name='email']", 'hi@datproject.org')
      .setValue(".register form input[name='password']", 'fnordfoobar')
      .submitForm('.register form')
      .expect.element('.register form .error').text.matches(/email not in invite list/).before(5000)

    client.end()
  }

  testCases['Registration works'] = (client) => {
    client
      .url(testServer + '/register')
      .assert.containsText('body', 'Register Your Dat Account')

    client
      .setValue(".register form input[name='username']", 'testuser')
      .setValue(".register form input[name='email']", 'hi@pam.com')
      .setValue(".register form input[name='password']", 'fnordfoobar')
      .submitForm('.register form')

    client
      .pause(2000)
      .assert.urlEquals(process.env.TEST_SERVER + '/install')

    client.end()
  }

  testCases['duplicated registration should fail'] = (client) => {
    client
      .url(testServer + '/register')
      .assert.containsText('body', 'Register Your Dat Account')

    client
      .setValue(".register form input[name='username']", 'testuser')
      .setValue(".register form input[name='email']", 'hi@pam.com')
      .setValue(".register form input[name='password']", 'fnordfoobar')
      .submitForm('.register form')
      .expect.element('.register form .error').text.matches(/Cannot create account with that email address/).before(5000)

    client.end()
  }
}
