var debug = require('debug')('compiled')
var la = require('lazy-ass')
var is = require('check-more-types')
var getConfig = require('./get-config')
var utils = require('./utils')
var path = require('path')
var saveFile = require('fs').writeFileSync

function roll (inputFilename, outputFilename) {
  var rollup = require('rollup')

  return rollup.rollup({
    entry: inputFilename
  }).then(function (bundle) {
    return bundle.write({
      format: 'cjs',
      dest: outputFilename
    }).then(function () {
      debug('saved bundle', outputFilename)
      return outputFilename
    })
  })
}

function findUsedES6 (outputFilename, filename) {
  var testify = require('es-feature-tests/testify')
  debug('scanning for es features', filename)
  var output = testify.scan({
    files: filename,
    output: 'json',
    enable: []
  })
  la(is.array(output), 'expected list of features', output)

  // var extraTests = require('./extra-tests')
  // if (extraTests.usesPromises(filename)) {
  //   output.push('promises')
  // }

  output = output.sort()
  debug('used ES features', output)

  saveFile(outputFilename, JSON.stringify(output, null, 2), 'utf-8')
  debug('saved file with found es features', outputFilename)
}

function buildBundle (inputFilename, toDir, name) {
  la(is.unemptyString(inputFilename), 'missing input filename', inputFilename)
  la(is.unemptyString(toDir), 'missing output dir name', toDir)
  la(is.unemptyString(name), 'missing bundle name', name)

  var outputFilename = path.join(toDir, utils.builtName(name))
  debug('building %s from %s to %s', name, inputFilename, outputFilename)
  var featuresFilename = path.join(toDir, utils.featuresName(name))

  return roll(inputFilename, outputFilename)
    .then(findUsedES6.bind(null, featuresFilename))
    .catch(function (err) {
      console.error('problem building', inputFilename)
      console.error(err.message)
      process.exit(-1)
    })
}

function build () {
  var config = getConfig()
  debug('found %d files in to build', config.files.length)
  var promises = config.files.map(function (filename) {
    return buildBundle(filename, config.dir, utils.bundleName(filename))
  })
  return Promise.all(promises)
}

module.exports = build
