# datBase

Open data powered by Dat. Future-friendly apps for your research data pipeline. Hosted at [http://datbase.org](http://datbase.org).

[![Build Status](https://travis-ci.org/datproject/datBase.svg?branch=master)](https://travis-ci.org/datproject/datBase)

## Deprecated

There are no active maintainers.

## Features

* Preview the files in a dat in the browser.
* Download individual files from dats.
* Create short links for dats with user accounts.

## Setup

0. Clone this repository, then copy the configuration file:

```
cp config/default.js config/config.development.js
```

1. Install the dependencies:

```
npm install
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


### Secret key

Each deployment should have a different secret key. You want to set the secret key for generating password hashes and salts.

Set the secret key by using the `TOWNSHIP_SECRET` environment variable.

### Default location of account and sqlite databases

Specify where you want data for the app (databases and also by default the archiver) to be located. By default, all the data will be stored in `./data`. If you'd like the data to be stored somewhere else, add a `data` key:

```
{
  data: '/path/to/my/data'
}
```

### Closed beta

To create a closed beta, add the `whitelist` key with the path to a newline-delimited list of emails allowed to sign up. Default value `false` allows anyone to register an account.

```
{ whitelist: '/path/to/my/list/of/folks.txt'}
```

`folks.txt` should have a list of valid emails, each separated by a new line character. For example:

```
pamlikesdata@gmail.com
robert.singletown@sbcglobal.netw
```

### Location of cached and archived dat data

You can set the location where dat data is cached on the filesystem. By default it is stored in the `data` directory (above), in the `archiver` subdirectory. You can change this by using the `archiver` key:

```
{ archiver: '/mnt1/bigdisk/archiver-data' }
```

### Mixpanel account

The site will report basic information to Mixpanel if you have an account. It will by default use the environment variable `MIXPANEL_KEY`.

This can also be set in the configuration file by using the `mixpanel` key:

```
{ mixpanel: '<my-api-key-here>' }
```

### Advanced password security

If you want to have advanced security for generating passwords, you can use ES512 keys, for example. Generate the keys using [this tutorial](https://connect2id.com/products/nimbus-jose-jwt/openssl-key-generation) and set their locations in the configuration file.

```
{
  township: {
    db: 'township.db',
    publicKey: path.join('secrets', 'ecdsa-p521-public.pem'),
    privateKey: path.join('secrets', 'ecdsa-p521-private.pem'),
    algorithm: 'ES512'
  }
}
```
