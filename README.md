# dat.land

An online place for dats.

[![Build Status](https://travis-ci.org/datproject/dat.land.svg?branch=master)](https://travis-ci.org/datproject/dat.land)

[Try dat.land now](http://dat.land)

## News

We were recently awarded a [$420,000 grant by the Knight Foundation](http://www.knightfoundation.org/grants/201551933/) to get started on this project. It will be undergiong heavy development for the next few months.

### develop

```
npm install
```

Do all of the below (watch assets and start server) in one command:
```
npm run dev
```

Start the server:

```
npm start
```

To watch and build scss and javascript changes as you go (in a separate terminal):

```
npm run watch-css
npm run watch-js
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

to test your access to machine via shipit from your local command line, call shipit, then the environment (in this case `uat`, which is tracking the master branch), then the actual command which corresponds to tasks defined in the shipitfile:
```
shipit uat pwd
```

to deploy and install a build on remote machine (note that shipit pulls build source from github, not your local project dir):
```
npm run deploy
```
