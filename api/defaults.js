var config = {
  'DEBUG': true,
  'PORT': 5000,
  'DAT_REGISTRY_HOSTNAME': 'http://localhost',
  'DAT_REGISTRY_HOST': 'http://localhost:5000',
  'DAT_REGISTRY_DB': '../data',

  'GITHUB_CLIENT': undefined,
  'GITHUB_SECRET': undefined
}

// override the settings with env vars for multi-deploy scenarios
for (v in config) {
  if (process.env.hasOwnProperty(v)) {
    config[v] = process.env[v]
  }
}

module.exports = config