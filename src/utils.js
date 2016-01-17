var la = require('lazy-ass')
var is = require('check-more-types')
var path = require('path')

function bundleName (filename) {
  la(is.unemptyString(filename), 'expected filename', filename)
  return path.basename(filename, '.js')
}

function builtName (name) {
  la(is.unemptyString(name), 'expected name', name)
  return name + '.bundle.js'
}

function featuresName (name) {
  la(is.unemptyString(name), 'expected name', name)
  return name + '.features.json'
}

function compiledName (name) {
  la(is.unemptyString(name), 'expected name', name)
  return name + '.compiled.js'
}

module.exports = {
  bundleName: bundleName,
  builtName: builtName,
  featuresName: featuresName,
  compiledName: compiledName
}
