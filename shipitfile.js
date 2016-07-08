var pkg = require('./package.json')

module.exports = function (shipit) {
  require('shipit-deploy')(shipit)

  shipit.initConfig({
    default: {
      workspace: './.tmp-deploy',
      repositoryUrl: pkg.repository.url,
      ignores: ['.git', 'node_modules'],
      rsync: ['--del'],
      keepReleases: 2
    },
    staging: {
      servers: process.env.DATLAND_USER + '@dat.land',
      deployTo: 'src/dat.land/staging'
    }
  })

  shipit.task('pwd', function () {
    return shipit.remote('pwd')
  })

  shipit.task('install', function () {
    var current = shipit.config.deployTo + '/current'
    shipit.log('running `shipit install` in remote ' + current)
    return shipit.remote(
      'cd ' + current +
      ' && npm install && npm run build && npm run minify && npm run version'
    )
  })
}
