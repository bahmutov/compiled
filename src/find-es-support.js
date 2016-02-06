/*
To use:
    nvm 0.12
    node find-es-support.js > es.for.0.12.json
*/
var debug = require('debug')('compiled')
var es6support = require('es-feature-tests')

var findES6Support

if (typeof Promise === 'undefined') {
  debug('missing Promises in the environment')
  findES6Support = function findES6Support () {
    return new Promise(function (resolve) {
      es6support('all', resolve)
    })
  }
} else {
  debug('using default es6 feature tests')
  findES6Support = function findES6Support () {
    return new Promise(function (resolve) {
      es6support('all', resolve)
    })
  }
}

module.exports = findES6Support

if (!module.parent) {
  es6support('all', function (features) {
    console.log(JSON.stringify(features, null, 2))
  })
}
