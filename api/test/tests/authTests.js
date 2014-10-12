var request = require('request').defaults({json: true})

module.exports.login = function(test, common) {
  test('/auth/login/ success', function(t) {
    common.testPOST(t, '/auth/login/', function(result) {

    })
  })
}


module.exports.createUser = function(test, common) {
  test('/auth/create/ success', function(t) {
    common.testPOST(t, '/auth/create/', function(result) {
      
    })
  })
}


module.exports.all = function(test, common) {
  module.exports.login(test, common);
  module.exports.createUser(test, common);
}