var settings = {
  src_folders: ['./tests/e2e'],
  output_folder: './reports',
  live_output: true,
  parallel_process_delay: 3500,

  selenium: {
    'start_process': true,
    'server_path': require('selenium-server-standalone-jar').path,
    'log_path': '',
    'cli_args': {
      'webdriver.chrome.driver': './node_modules/.bin/chromedriver',
      'webdriver.firefox.profile': 'default'
    }
  },

  'test_settings': {
    'default': {
      'launch_url': 'http://localhost',
      'selenium_port': 4444,
      'selenium_host': 'localhost',
      silent: true,
      'screenshots': {
        'enabled': false,
        'path': './screenshots'
      },
      'globals': {

      }
    },
    'firefox': {
      'desiredCapabilities': {
        'browserName': 'firefox',
        'javascriptEnabled': true
      }
    },
    'chrome': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'javascriptEnabled': true
      }
    }
  }
}

var fs = require('fs')

module.exports = (function (settings) {
  var chrome = process.env.DATLAND_CHROME_PATH || '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary'
  try {
    fs.statSync(chrome)
    settings.test_settings.chrome.desiredCapabilities.chromeOptions = { binary: chrome }
  } catch (e) { }
  if (!(process.env.__NIGHTWATCH_ENV_KEY || '').match(/_1$/)) {
    settings.output_folder = false
    settings.output = false
  }
  return settings
})(settings)
