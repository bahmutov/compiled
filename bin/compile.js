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

// require || takes care of self-build
var compile = require('..').compile ||
  require('../src/compile')

compile()
  .catch(function (err) {
    console.error('problem compiling')
    console.error(err.message)
    console.error(err.stack)
    process.exit(-1)
  })
