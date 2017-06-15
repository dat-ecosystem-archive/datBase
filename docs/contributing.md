# Contributing

Install dependencies.

```
npm install
```

Initialize the database. You only have to do this once:

```
node server/database/init.js
```

Watch assets and start server in one command:

```
npm start
```

## Creating example user and dat

Run the following command to create a user with the given email address. The
user will have the password `dogsandcats.`

```
node scripts/user-and-dat.js <email-address>
```

To create just dats for a given user that already exists, use
```
node scripts/add-dats-for-user.js <email-address> <password>
```

## Running end-to-end tests

Docker and `docker-compose` are required.

```
docker-compose build
docker-compose up -d newdat && sleep 10
docker-compose run --rm nightwatch
```

You may also see the test browser in action with [VNC](https://github.com/blueimp/nightwatch).
