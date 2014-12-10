module.exports = MockLoginProvider

function MockLoginProvider(user) {
  var self = this
  self.user = {
    handle: 'karissa',
    password: 'password',
    data: {
      email: 'karissa-dontemailme@dontemailme.com',
      name: 'karissa',
      location: 'oakland',
      bio: '',
      blog: 'blogspot.blog.com',
      company: 'haha',
      id: 12313,
      login: 'karissa'
    }
  }
}

MockLoginProvider.prototype.login = function (req, res) {
  var self = this
  req.session.del('userid', function (err) {
    if (err) throw err
    req.session.set('userid', self.user.handle, function (err) {
      if (err) throw err
      res.end(self.user.handle)
    })
  })
}

MockLoginProvider.prototype.logout = function (req, res) {
  var self = this
  req.session.del('userid', function (err) {
    if (err) throw err
    res.end()
  })
}
