#!/bin/bash
standard
node tests/new-dat &
npm run clean-test 
NODE_ENV=test npm run database tests/test-api.sqlite
NODE_ENV=test tape tests/unit/*.js | tap-spec

