require('babel-polyfill')

var debug = require('debug')('compiled')
var la = require('lazy-ass')
var is = require('check-more-types')
var es6support = require('es-feature-tests')
var join = require('path').join

var esFeaturesFilename = join(process.cwd(), './dist/es6-features')

// TODO ?
function includePolyfill (transpiledSource) {
  debug('including Babel polyfill in transpiled code')
  return transpiledSource
}

function transpile (supportedFeatures, neededFeatures, inputFilename, outputFilename) {
  var babelMapping = {
    letConst: ['transform-es2015-block-scoping'],
    templateString: 'transform-es2015-template-literals',
    arrow: 'transform-es2015-arrow-functions',
    parameterDestructuring: ['transform-es2015-parameters', 'transform-es2015-destructuring'],
    promises: includePolyfill
  }

  var plugins = [] // plugin names
  var postProcessors = [] // functions

  function addUniquePlugin (name) {
    if (!name) {
      return
    }
    if (plugins.indexOf(name) === -1) {
      plugins.push(name)
    }
  }

  function addPlugin (names) {
    if (is.fn(names)) {
      if (postProcessors.indexOf(names) === -1) {
        postProcessors.push(names)
      }
      return
    }

    if (typeof names === 'string') {
      return addUniquePlugin(names)
    }
    if (Array.isArray(names)) {
      names.forEach(addPlugin)
    }
  }

  neededFeatures.forEach(function (feature) {
    if (!supportedFeatures[feature]) {
      var needPlugins = babelMapping[feature]
      if (!needPlugins) {
        console.log('WARNING: feature', feature, 'is not handled')
        return
      }
      addPlugin(needPlugins)
    }
  })

  debug('using plugins', plugins)

  var babel = require('babel-core')
  var options = {
    plugins: plugins
  }

  return new Promise(function (resolve, reject) {
    babel.transformFile(inputFilename, options, function (err, result) {
      debug('transformed file', inputFilename, 'was there an error?', err)
      if (err) {
        return reject(err)
      }

      var output = result.code
      if (postProcessors.length) {
        debug('running %d post processors', postProcessors.length)
        postProcessors.forEach(function (fn, k) {
          la(is.fn(fn), 'expected post processor function at', k)
          output = fn(output)
        })
      }

      require('fs').writeFileSync(outputFilename, output, 'utf-8')
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

  return new Promise(function (resolve, reject) {
    es6support('all', function (es6results) {
      return transpile(es6results, es6features, inputFilename, outputFilename)
        .then(resolve)
        .catch(reject)
    })
  })
}

module.exports = compile
