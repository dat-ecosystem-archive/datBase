#!/bin/bash
standard
node tests/new-dat &
npm run clean-test
NODE_ENV=test npm run database ${PWD}/config/config.test.js  
NODE_ENV=test tape tests/unit/*.js | tap-spec
