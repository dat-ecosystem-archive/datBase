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
    prod: {
      processName: 'prod',
      servers: process.env.DATLAND_USER + '@dat.land',
      deployTo: 'src/dat.land/prod',
      branch: 'master'
    },
    uat: {
      processName: 'uat',
      servers: process.env.DATLAND_USER + '@dat.land',
      deployTo: 'src/dat.land/uat',
      branch: 'master'
    }
  })

  shipit.task('pwd', function () {
    return shipit.remote('pwd')
  })

  shipit.task('install', function () {
    var current = shipit.config.deployTo + '/current'
    shipit.log('running `shipit install` in remote ' + current)
    return shipit.remote(
      `cd ${current} && npm install --production && npm run build && npm run minify && npm run version`
    )
  })

  shipit.task('restart', function () {
    shipit.remote(`source ~/.bash_profile && psy restart ${shipit.config.processName}`)
  })
}
