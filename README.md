Dat Registry
===========

[![build status](https://secure.travis-ci.org/karissa/dat-registry.png)](http://travis-ci.org/karissa/dat-registry)

This is initially built as a web client that will host a simple index and registry of metadata related to hosted dats. It is *not* a hosting service for dats themselves.

See the website at http://dat-data.com for more information.

## Setting up

Install dependencies
```bash
$ npm install
```

Have github app keys in your environment (same environment that will run ```npm start```)
```bash
export GITHUB_CLIENT='client-key-here'
export GITHUB_SECRET='secret-key-here'
```

Run the server
```bash
$ npm start
```

You can also run the file watchers and server individually if you prefer to have them in separate terminals:

Watch your browserify and less bundles (in separate terminals)
```bash
$ npm run watch
```

```bash
$ npm run watch-css
```

Run just the server:
```
$ npm run server
```
