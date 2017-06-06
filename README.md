# Dat Registry

A web registry for the dat network. Hosted at [http://datproject.org](http://datproject.org).

[![Build Status](https://travis-ci.org/datproject/datproject.org.svg?branch=master)](https://travis-ci.org/datproject/datproject.org)

## Features

* Preview the files in a dat in the browser.
* Download individual files from dats.
* Create short links for dats with user accounts.

## Setup

Clone this repository, then copy the default config file to `config.local.js`

```
npm install
cp config/index.js config.local.js
```

Create the database

```
npm run database
```

Start the server
```
npm start
```

## Configuration

User accounts are created using [township](http://github.com/township), a modular user account system.

```
township: {
  secret: '<VERY SECRET KEY>'
  db: '<LOCATION OF DATABASE>'
},
```
