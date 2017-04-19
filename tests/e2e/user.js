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
      .pause(10000)
      .execute(function (data) {
        /* eslint-disable */
        return location;
      }, [], function (result) {
        console.log(result)
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

  testCases['view profile should work'] = (client) => {
    client
      .url(testServer + '/profile/testuser')
      .assert.containsText('body', 'has published 0 dats')
      .assert.containsText('body', 'testuser')

    client.end()
  }

  testCases['edit profile should work'] = (client) => {
    client
      .url(testServer + '/profile/edit')
      .assert.containsText('body', 'Edit your Profile')

    client
      .pause(5000)
      .setValue(".edit-profile form input[name='description']", 'testing description')
      .submitForm('.edit-profile form')
    client
      .url(testServer + '/profile/testuser')
      .assert.containsText('body', 'testing description')
      .assert.containsText('body', 'testuser')

    client.end()
  }
}
