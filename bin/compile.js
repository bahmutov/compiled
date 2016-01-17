#!/usr/bin/env node

'use strict'

var help = [
  'USE: compile',
  '     - transpiles dist/bundle.js into dist/compiled.js'
].join('\n')

require('simple-bin-help')({
  minArguments: 2,
  packagePath: __dirname + '/../package.json',
  help: help
})

var inputFilename = './dist/bundle.js'
var outputFilename = './dist/compiled.js'
// require || takes care of self-build
var compile = require('..').compile ||
  require('../src/compile')

compile(inputFilename, outputFilename)
  .catch(function (err) {
    console.error('problem building', inputFilename)
    console.error(err.message)
    console.error(err.stack)
    process.exit(-1)
  })
