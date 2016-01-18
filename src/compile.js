require('babel-polyfill')

var debug = require('debug')('compiled')
var la = require('lazy-ass')
var is = require('check-more-types')
var utils = require('./utils')
var es6support = require('es-feature-tests')
var getConfig = require('./get-config')
var path = require('path')
var fs = require('fs')

function transpile (supportedFeatures, neededFeatures, inputFilename, outputFilename) {
  var babelMapping = {
    letConst: ['transform-es2015-block-scoping'],
    templateString: 'transform-es2015-template-literals',
    arrow: 'transform-es2015-arrow-functions',
    parameterDestructuring: ['transform-es2015-parameters', 'transform-es2015-destructuring']
  }

  var plugins = [] // plugin names

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

      var output = utils.finishTextWithEndline(result.code)
      require('fs').writeFileSync(outputFilename, output, 'utf-8')
      debug('saved file', outputFilename)
      resolve(outputFilename)
    })
  })
}

function compileBundle (inputFilename, esFeaturesFilename, outputFilename) {
  la(is.unemptyString(inputFilename), 'missing input filename')
  la(is.unemptyString(outputFilename), 'missing output filename')

  var es6features = JSON.parse(fs.readFileSync(esFeaturesFilename, 'utf-8'))
  la(is.array(es6features),
    'expected list of features from', esFeaturesFilename,
    'got', es6features)
  debug('need es6 features', es6features)

  return new Promise(function (resolve, reject) {
    es6support('all', function (es6results) {
      return transpile(es6results, es6features, inputFilename, outputFilename)
        .then(resolve)
        .catch(reject)
    })
  })
}

function compile () {
  var config = getConfig()
  debug('found %d files in to build', config.files.length)
  var promises = config.files.map(function (filename) {
    var name = utils.bundleName(filename)
    var builtFilename = path.join(config.dir, utils.builtName(name))
    var featuresFilename = path.join(config.dir, utils.featuresName(name))
    var compiledFilename = path.join(config.dir, utils.compiledName(name))

    debug('compile %s from %s and %s to %s',
      name, builtFilename, featuresFilename, compiledFilename)

    return compileBundle(builtFilename, featuresFilename, compiledFilename)
  })
  return Promise.all(promises)
}

module.exports = compile
