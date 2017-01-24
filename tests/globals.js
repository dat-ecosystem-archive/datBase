'use strict'

module.exports = {
  beforeEach: function (browser, done) {
    require('nightwatch-video-recorder').start(browser, done)
  },
  afterEach: function (browser, done) {
    require('nightwatch-video-recorder').stop(browser, done)
  }
}
