# datfolder

A registry for dats.

[![Build Status](https://travis-ci.org/datproject/datfolder.svg?branch=master)](https://travis-ci.org/datproject/datfolder)

[Try dat.land now](http://dat.land)

## API

##### ```GET /api/v1/:model```

Can pass query parameters like `?username='martha'` to filter results.

Additional options:

  * `limit`: 100 (default)
  * `offset`: 0 (default)

##### ```POST /api/v1/:model```

Success returns model with `id` field added.

##### ```PUT /api/v1/:model?id=```

`id` required

Success returns number of rows modified.
```
{updated: 1}
```

##### ```DELETE /api/v1/:model?id=```

`id` required

Success returns number of rows deleted.
```
{deleted: 1}
```

##### users model: ```/api/v1/users```

- `id` (required)
- `email` (required)
- `username`
- `description`
- `created_at`
- `updated_at`

##### dats model: ```/api/v1/dats```

- `id`
- `user_id`
- `name`
- `title`
- `hash`
- `description`
- `created_at`
- `updated_at`

#####  ```/api/v1/register```
#####  ```/api/v1/login```

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

### Getting test user and dat

Run the following command to create a user with the given email address. The
user will have the password `dogsandcats.`

```
node server/database/populate.js <email-address>
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
