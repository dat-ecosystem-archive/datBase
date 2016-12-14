# dat.land

An online place for dats.

[![Build Status](https://travis-ci.org/datproject/dat.land.svg?branch=master)](https://travis-ci.org/datproject/dat.land)

[Try dat.land now](http://dat.land)

## News

We were recently awarded a [$420,000 grant by the Knight Foundation](http://www.knightfoundation.org/grants/201551933/) to get started on this project. It will be undergoing heavy development for the next few months.

### API

#### Users

`id` always required.

Fields:
- `id`
- `username`
- `email`
- `description`

NOTE: ```POST /api/v1/users``` Method not allowed. Use /auth/v1/register instead.

#### Dats

Fields:
- `id`
- `user_id`
- `name`
- `title`
- `hash`
- `description`

##### ```GET /api/v1/:model```

Responds with a list of results that match the query. Can pass query parameters
like `?username='martha'` or `?name=cats` to filter results.

##### ```PUT /api/v1/:model```

`id` required.

Success returns number of updated rows ```{updated: num}```

##### ```DELETE /api/v1/:model```

`id` required. 

Success returns number of deleted rows ```{deleted: 1}```

#### ```POST /api/v1/:model```

Success returns the model as it exists in the database.


### develop

```
npm install
```

Watch assets and start server in one command:

```
npm start
```

### Initialize database

```
node server/database/init.js
```

### build for production
```
npm run build
npm run minify
npm run version
```

### end-to-end tests

Chrome:

```
npm run build
npm run start &
DATLAND_CHROME_PATH=/path/to/chrome_bin TEST_SERVER=http://localhost:8080 npm run test:e2e
```

Firefox: (currently not working)

```
TEST_SERVER=http://localhost:8080 npm run test:e2e:firefox
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
