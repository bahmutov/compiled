var debug = require('debug')('compiled')
var la = require('lazy-ass')
var is = require('check-more-types')
var join = require('path').join
var exists = require('fs').existsSync

function noConfig (pkg) {
  return !pkg.config
}

function noCompiled (config) {
  return !config.compiled
}

var isValidConfig = is.object

function getConfig () {
  var filename = join(process.cwd(), 'package.json')
  debug('loading compiled config from', filename)
  if (!exists(filename)) {
    throw new Error('Cannot find file ' + filename)
  }
  var pkg = require(filename)
  if (noConfig(pkg)) {
    debug(pkg)
    throw new Error('Cannot find config object in package ' + filename)
  }
  if (noCompiled(pkg.config)) {
    debug(pkg.config)
    throw new Error('Cannot find settings for compiled in config in package ' + filename)
  }
  la(isValidConfig(pkg.config.compiled), 'invalid compiled config in', filename)
  return pkg.config.compiled
}

function getBuildConfig () {
  var config = getConfig()
  var isConfig = is.schema({
    dir: is.unemptyString,
    files: is.array
  })
  la(isConfig(config), 'invalid compiled config', config)
  return config
}

module.exports = getBuildConfig
