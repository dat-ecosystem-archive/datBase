Dat Registry
===========

[![build status](https://secure.travis-ci.org/karissa/dat-registry.png)](http://travis-ci.org/karissa/dat-registry)

This is initially built as a web client that will host a simple index and registry of metadata related to hosted dats. It is *not* a hosting service for dats themselves.

See the website at http://dat-data.com for more information.

## Setting up

0. Install dependencies
```bash
$ npm install
```

1. Have github oauth keys in your environment (same environment that will run ```npm start```)

```bash
export GITHUB_CLIENT='client-key-here'
export GITHUB_SECRET='secret-key-here'
```

2. Watch your browserify and less bundles
```bash
$ npm run watch
$ npm run watch-css
```

3. Run the server
```bash
$ npm start
```