var filename = './dist/bundle.js'
var outFilename = './dist/compiled.js'

var es6features = require('./dist/es6-features')
console.log('need es6 features', es6features)

var es6support = require('es-feature-tests')
es6support('all', function (es6results) {
  // console.log('es6 supported features')
  // console.log(es6results)
  transpile(es6results, es6features, filename, outFilename)
})

function transpile (supportedFeatures, neededFeatures, inputFilename, outputFilename) {
  var babelMapping = {
    letConst: ['transform-es2015-block-scoping'],
    templateString: 'transform-es2015-template-literals',
    arrow: 'transform-es2015-arrow-functions'
  }

  var plugins = []

  function addUniquePlugin (name) {
    if (!name) {
      return
    }
    if (plugins.indexOf(name) === -1) {
      plugins.push(name)
    }
  }

  function addPlugin (names) {
    if (typeof names === 'string') {
      return addUniquePlugin(names)
    }
    if (Array.isArray(names)) {
      names.forEach(addPlugin)
    }
  }

  neededFeatures.forEach(function (feature) {
    if (!supportedFeatures[feature]) {
      addPlugin(babelMapping[feature])
    }
  })

  console.log('using plugins', plugins)

  var babel = require('babel-core')
  var options = {
    plugins: plugins
  }
  babel.transformFile(filename, options, function (err, result) {
    if (err) { throw err }
    require('fs').writeFileSync(outFilename, result.code, 'utf-8')
    console.log('saved file', outFilename)
  })
}
