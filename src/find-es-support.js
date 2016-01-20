var es6support = require('es-feature-tests')

function findES6Support () {
  return new Promise(function (resolve) {
    es6support('all', resolve)
  })
}

module.exports = findES6Support

if (!module.parent) {
  findES6Support()
    .then(function (features) {
      console.log(JSON.stringify(features, null, 2))
    })
    .catch(console.error.bind(console))
}
