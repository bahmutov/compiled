#!/usr/bin/env node

'use strict'

var help = [
  'USE: build',
  'see https://github.com/bahmutov/compiled for help'
].join('\n')

require('simple-bin-help')({
  minArguments: 2,
  packagePath: __dirname + '/../package.json',
  help: help
})

var build = require('..').build

build()
  .catch(function (err) {
    console.error('problem building bundles')
    console.error(err.message)
    console.error(err.stack)
    process.exit(-1)
  })
