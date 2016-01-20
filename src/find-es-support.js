/*
To use:
    nvm 0.12
    node find-es-support.js > es.for.0.12.json
*/
var es6support = require('es-feature-tests')
var findES6Support

if (typeof Promise === 'undefined') {
  findES6Support = function findES6Support () {
    return new Promise(function (resolve) {
      es6support('all', resolve)
    })
  }
} else {
  findES6Support = es6support
}

module.exports = findES6Support

if (!module.parent) {
  es6support('all', function (features) {
    console.log(JSON.stringify(features, null, 2))
  })
}
