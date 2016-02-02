publicbits.org
===========

We were recently awarded a [$420,000 grant by the Knight Foundation](www.knightfoundation.org/grants/201551933/) to get started on this project. It will be undergiong heavy development for the next few months.

## Deployment

1. Have node installed.

1. Clone the repository.

1. Check api/defaults.js and change those values to ones appropriate for your machine. You can also set environment variables with the same name.

1. Setup

```
npm install
npm run build
```

1. Run
```
node server.js [--port=port]
```

## Develeper setup

Watch assets, recompiling them as they are edited during development, and run the server all in one command:

```
$ npm start
```

Run the file watchers and server individually if you prefer to have them in separate terminals:

```
$ npm run watch
```

```
$ npm run watch-css
```

```
$ npm run server
```

# License
Copyright (c) 2014, Karissa McKelvey All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
