# dat.land

An online place for dats.

[![Build Status](https://travis-ci.org/datproject/dat.land.svg?branch=master)](https://travis-ci.org/datproject/dat.land)

[Try dat.land now](http://dat.land)

## News

We were recently awarded a [$420,000 grant by the Knight Foundation](http://www.knightfoundation.org/grants/201551933/) to get started on this project. It will be undergiong heavy development for the next few months.

### develop
```
npm run build
npm run dev
```

To watch for scss changes and build css as you go (in a separate terminal):
```
npm run watch-css
```

### build for production
```
npm run build
npm run minify
npm run version
```

### using shipit for deployment and install
[shipit](https://github.com/shipitjs/shipit) and [shipit-deploy](https://github.com/shipitjs/shipit-deploy) depends on rsync version 3+, git version 1.7.8+, and OpenSSH version 5+. To upgrade rsync on a macosx machine, [follow instructions here](https://static.afp548.com/mactips/rsync.html) (see "compile rsync 3.0.7" section).

install shipit-cli locally, globally:
```
npm install shipit-cli -g
```

the config file is `shipitfile.js`. you'll need to set the environment var `DATLAND_USER` in your local shell for it to know which account to use to access the server.

to test your access to machine via shipit:
```
shipit staging pwd
```

to deploy and install a build (note that shipit pulls build source from github):
```
shipit staging deploy
shipit staging install
```
