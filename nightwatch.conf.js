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

function findChrome (paths) {
  for (var i in paths) {
    var path = paths[i]
    try {
      fs.statSync(path)
      return path
    } catch (e) {}
  }
  throw new Error('can not find chrome')
}

module.exports = (function (settings) {
  // XXX: if we are testing with firefox, we should skip the chrome path detection
  var paths = process.env.DATLAND_CHROME_PATH
    ? [ process.env.DATLAND_CHROME_PATH ]
    : ['/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
       '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
  settings.test_settings.chrome.desiredCapabilities.chromeOptions = { binary: findChrome(paths) }
  if (!(process.env.__NIGHTWATCH_ENV_KEY || '').match(/_1$/)) {
    settings.output_folder = false
    settings.output = false
  }
  return settings
})(settings)
