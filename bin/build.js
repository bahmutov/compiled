#!/usr/bin/env node

'use strict'

const help = [
  'USE: build <path/to/first/js/file>',
  '\t"build src/main.js'
].join('\n')

require('simple-bin-help')({
  minArguments: 1,
  packagePath: __dirname + '/../package.json',
  help: help
})
