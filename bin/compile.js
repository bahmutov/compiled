#!/usr/bin/env node

'use strict'

// do not run on itself when installing as 3rd party dependency
var path = require('path')
var fs = require('fs')
var packageFilename = path.join(process.cwd(), 'package.json')
if (fs.existsSync(packageFilename)) {
  var pkg = JSON.parse(fs.readFileSync(packageFilename))
  if (pkg.name === 'compiled') {
    process.exit(0)
  }
}

var help = [
  'USE: compile',
  '     - transpiles dist/bundle.js into dist/compiled.js'
].join('\n')

require('simple-bin-help')({
  minArguments: 2,
  packagePath: path.join(__dirname, '/../package.json'),
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
