var build = require('./build')
var compile = require('./compile')
module.exports = {
  build: build,
  compile: compile,
  babelPolyfill: function () {
    require('babel-polyfill')
  }
}
