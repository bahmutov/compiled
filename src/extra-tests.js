var la = require('lazy-ass')
var is = require('check-more-types')
var read = require('fs').readFileSync

function usesPromises (filename) {
  la(is.unemptyString(filename), 'expected filename')
  var source = read(filename, 'utf-8')
  return source.indexOf('Promise') !== -1
}

module.exports = {
  usesPromises: usesPromises
}
