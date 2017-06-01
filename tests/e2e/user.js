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
      .pause(10000)
      .assert.containsText('body', 'Powerful dataset sharing')  // install page
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

  testCases['login with bad password displays error message'] = (client) => {
    client
      .url(testServer + '/login')

    client
      .pause(5000)
      .setValue(".login form input[name='email']", 'hi@pam.com')
      .setValue(".login form input[name='password']", 'badpassword')
      .submitForm('.login form')
      .expect.element('.login form .error').text.matches(/Incorrect email and password./).before(5000)
  }

  testCases['login should work'] = (client) => {
    client
      .url(testServer + '/login')

    client
      .pause(5000)
      .setValue(".login form input[name='email']", 'hi@pam.com')
      .setValue(".login form input[name='password']", 'fnordfoobar')
      .submitForm('.login form')
      .pause(10000)
      .assert.containsText('body', 'Powerful dataset sharing')  // install page

    client.end()
  }

  testCases['edit profile should work'] = (client) => {
    client
      .url(testServer + '/profile/edit')
      .assert.containsText('body', 'Edit your Profile')

    client
      .pause(5000)
      .setValue(".edit-profile form textarea[name='description']", 'testing description')
      .submitForm('.edit-profile form')

    client.end()
  }
}
