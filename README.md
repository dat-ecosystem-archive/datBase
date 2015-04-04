Dathub
===========

[![build status](https://secure.travis-ci.org/karissa/dathub.png)](http://travis-ci.org/karissa/dathub)

This is a web client that will let you publish and collaborate with your data. It is *not* a data hosting service.

See the website at http://dat-data.com for more information.

## Develeper setup

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

# License
Copyright (c) 2014, Karissa McKelvey All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
