var debug = require('debug')('compiled')
var la = require('lazy-ass')
var is = require('check-more-types')
var utils = require('./utils')
var findES6Support = require('./find-es-support')
var getConfig = require('./get-config')
var fs = require('fs')
var babelMapping = require('es-features-to-babel-plugins')
la(is.object(babelMapping), 'expected object with mapping', babelMapping)

function transpile (supportedFeatures, neededFeatures, inputFilename, outputFilename,
  babelPolyfillModuleName) {
  var plugins = [] // plugin names
  // for now always include polyfill,
  // because hard to detect all edge cases when new methods are used
  var addBabelPolyfill = true

  function addUniquePlugin (name) {
    if (!name) {
      return
    }
    if (plugins.indexOf(name) === -1) {
      plugins.push(name)
    }
  }

  function addPlugin (names) {
    if (names === babelMapping.INCLUDE_BABEL_POLYFILL) {
      addBabelPolyfill = true
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
      if (addBabelPolyfill) {
        debug('adding Babel polyfill require')
        output = utils.addBabelRequire(output, babelPolyfillModuleName)
      }
      output = utils.finishTextWithEndline(output)

      require('fs').writeFileSync(outputFilename, output, 'utf-8')
      debug('saved file', outputFilename)
      resolve(outputFilename)
    })
  })
}

function compileBundle (es6results, inputFilename, esFeaturesFilename, outputFilename,
  moduleWithBabelPolyfill) {
  la(is.unemptyString(inputFilename), 'missing input filename')
  la(is.unemptyString(outputFilename), 'missing output filename')

  var name = utils.bundleName(inputFilename)

  var es6features = JSON.parse(fs.readFileSync(esFeaturesFilename, 'utf-8'))
  la(is.array(es6features),
    'expected list of features from', esFeaturesFilename,
    'got', es6features)
  debug('%s needs es6 features', name, es6features)

  return transpile(es6results,
    es6features, inputFilename, outputFilename, moduleWithBabelPolyfill)
}

var build = require('./build')

function anyMissingBuiltFiles (config) {
  return config.files.some(function (filename) {
    var filenames = utils.formFilenames(config, filename)
    return !fs.existsSync(filenames.built) ||
      !fs.existsSync(filenames.features)
  })
}

function compileBuiltFiles (config, esFeatures) {
  la(is.object(esFeatures), 'missing supported ES6 features')

  var promises = config.files.map(function (filename) {
    var filenames = utils.formFilenames(config, filename)

    debug('%s and %s => %s',
      filenames.built, filenames.features, filenames.compiled)

    return compileBundle(esFeatures,
      filenames.built, filenames.features, filenames.compiled,
      config.moduleWithBabelPolyfill)
  })
  return Promise.all(promises)
}

function compile (options) {
  var config = is.object(options) ? options : getConfig()
  debug('found %d files to compile', config.files.length)

  var start = Promise.resolve(true)
  if (anyMissingBuiltFiles(config)) {
    console.log('missing build bundles, building ...')
    start = start.then(build)
  } else {
    debug('all built bundles are present')
  }

  var environmentESFeatures = is.object(config.esFeatures)
    ? Promise.resolve.bind(Promise, options.esFeatures)
    : findES6Support

  return start
    .then(environmentESFeatures)
    .then(compileBuiltFiles.bind(null, config))
}

module.exports = compile
