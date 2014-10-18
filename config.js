var config = {
  'DEBUG': true,
  'PORT': 5000,
  'DAT_REGISTRY_HOSTNAME': 'http://localhost',
  'DAT_REGISTRY_HOST': 'http://localhost:5000',
  'DAT_REGISTRY_DB': '/tmp/db',

  'GITHUB_CLIENT': '50c5c047c8dc0bf07ab0',
  'GITHUB_SECRET': 'b1d79519c71bd2d76bb8357aa4e46629aabbe246'
}

// override the settings with env vars for multi-deploy scenarios
for (v in config) {
  if (process.env.hasOwnProperty(v)) {
    config[v] = process.env[v]
  }
}

module.exports = config