# dat.land

An online place for dats.

[![Build Status](https://travis-ci.org/datproject/datfolder.svg?branch=master)](https://travis-ci.org/datproject/datfolder)

[Try dat.land now](http://dat.land)

## API

#### Users

Fields:
- `id` (required)
- `email` (required)
- `username`
- `description`

NOTE: ```POST /api/v1/users``` Method not allowed. Use /api/v1/register instead.

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

Success returns number of updated rows (e.g., ```{updated: 1}```)

##### ```DELETE /api/v1/:model```

`id` required. 

Success returns number of deleted rows (e.g., ```{deleted: 1}```)

##### ```POST /api/v1/:model```

Success returns the model as it exists in the database.


### Develop

Install dependencies.

```
npm install
```

Create config file.

You can use defaults by copying the example config to `config.js`. If you want to some other database, you can change these defaults in `config.js`.

```
cp example.config.js config.js
```

Initialize the database. You only have to do this once:

```
node server/database/init.js
```


Watch assets and start server in one command:

```
npm start
```

Load some test data (optional).

```
node server/database/populate.js
```

### Build for production
```
npm run build
npm run minify
npm run version
```

### Running end-to-end tests

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

### Using shipit for deployment and install
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
