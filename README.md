# datproject.org

A registry for dats. [datproject.org](http://datproject.org)

[![Build Status](https://travis-ci.org/datproject/datproject.org.svg?branch=master)](https://travis-ci.org/datproject/datproject.org)

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

You can use override the defaults by copying `./config/index.js` to
`./config.js` and make changes.

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

### Getting invited-users list

```
git clone git@github.com:datproject/invited-users.git
```


### Running end-to-end tests

Docker and `docker-compose` are required.

```
docker-compose build
docker-compose up -d newdat && sleep 10
docker-compose run --rm nightwatch
```

You may also see the test browser in action with [VNC](https://github.com/blueimp/nightwatch).
