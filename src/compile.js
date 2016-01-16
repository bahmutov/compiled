var debug = require('debug')('compiled')
var la = require('lazy-ass')
var is = require('check-more-types')
var es6support = require('es-feature-tests')
var join = require('path').join

var esFeaturesFilename = join(process.cwd(), './dist/es6-features')

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

  debug('using plugins', plugins)

  var babel = require('babel-core')
  var options = {
    plugins: plugins
  }

  return new Promise(function (resolve, reject) {
    babel.transformFile(inputFilename, options, function (err, result) {
      if (err) {
        return reject(err)
      }
      require('fs').writeFileSync(outputFilename, result.code, 'utf-8')
      debug('saved file', outputFilename)
      resolve(outputFilename)
    })
  })
}

function compile (inputFilename, outputFilename) {
  la(is.unemptyString(inputFilename), 'missing input filename')
  la(is.unemptyString(outputFilename), 'missing output filename')

  var es6features = require(esFeaturesFilename)
  debug('need es6 features', es6features)

  return new Promise(function (resolve) {
    es6support('all', function (es6results) {
      return transpile(es6results, es6features, inputFilename, outputFilename)
    })
  })
}

module.exports = compile
