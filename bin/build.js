#!/usr/bin/env node

'use strict'

var help = [
  'USE: build <path/to/first/js/file>',
  '     build src/main.js'
].join('\n')

require('simple-bin-help')({
  minArguments: 3,
  packagePath: __dirname + '/../package.json',
  help: help
})

var inputFilename = process.argv[2]
var build = require('..').build

build(inputFilename)
  .catch(function (err) {
    console.error('problem building', inputFilename)
    console.error(err.message)
    console.error(err.stack)
    process.exit(-1)
  })
