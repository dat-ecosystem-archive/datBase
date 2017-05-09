var testServer = process.env.TEST_SERVER || 'https://datproject.org'

module.exports = new function () {
  var testCases = this
  testCases['Registration works'] = (client) => {
    client
      .url(testServer + '/register')
      .assert.containsText('body', 'Create a New Account')

    client
      .setValue(".register form input[name='username']", 'testuser')
      .setValue(".register form input[name='email']", 'hi@pam.com')
      .setValue(".register form input[name='password']", 'fnordfoobar')
      .submitForm('.register form')

    client
      .pause(5000)
      .execute(function(data) {
        return location;
      }, [], function(result) {
        console.log(result.value.href);
      })
      .assert.urlEquals(process.env.TEST_SERVER + '/install')

    client.end()
  }

  testCases['duplicated registration should fail'] = (client) => {
    client
      .url(testServer + '/register')
      .assert.containsText('body', 'Create a New Account')

    client
      .setValue(".register form input[name='username']", 'testuser')
      .setValue(".register form input[name='email']", 'hi@pam.com')
      .setValue(".register form input[name='password']", 'fnordfoobar')
      .submitForm('.register form')
      .expect.element('.register form .error').text.matches(/Account with that email already exists./).before(5000)

    client.end()
  }
}
