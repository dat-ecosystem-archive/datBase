var debug = require('debug')('admin')

var dathubClient = require('../../hub')

module.exports = function (data) {
  return {
    data: data,
    template: require('./index.html'),
    onrender: function () {}
  }
}
