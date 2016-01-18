var la = require('lazy-ass')
var is = require('check-more-types')
var path = require('path')
var fs = require('fs')

function bundleName (filename) {
  la(is.unemptyString(filename), 'expected filename', filename)
  return path.basename(filename, '.js')
}

function builtName (name) {
  la(is.unemptyString(name), 'expected name', name)
  return name + '.bundle.js'
}

function featuresName (name) {
  la(is.unemptyString(name), 'expected name', name)
  return name + '.features.json'
}

function compiledName (name) {
  la(is.unemptyString(name), 'expected name', name)
  return name + '.compiled.js'
}

function getFirstLine (filename) {
  var text = fs.readFileSync(filename, 'utf-8')
  return text.substr(0, text.indexOf('\n'))
}

function isHashbang (line) {
  return /^#!/.test(line)
}

function removeFirstLine (filename) {
  var text = fs.readFileSync(filename, 'utf-8')
  text = text.substr(text.indexOf('\n') + 1)
  fs.writeFileSync(filename, text, 'utf-8')
}

function restoreFirstLine (filename, line) {
  la(is.unemptyString(line), 'missing first line to add to', filename)
  var text = fs.readFileSync(filename, 'utf-8')
  text = line + '\n' + text
  fs.writeFileSync(filename, text, 'utf-8')
}

// TODO ends with newline could be its own small module
function endsWithNewLines (text) {
  return /\n\n$/.test(text)
}

function finishTextWithEndline (text) {
  la(is.string(text), 'expected text', text)
  if (!endsWithNewLines(text)) {
    text += '\n'
  }
  return text
}

function finishWithEndline (filename) {
  var text = fs.readFileSync(filename, 'utf-8')
  text = finishTextWithEndline(text)
  fs.writeFileSync(filename, text, 'utf-8')
}

function formFilenames (dir, filename) {
  la(is.unemptyString(filename), 'expected filename', filename)
  var name = bundleName(filename)
  var builtFilename = path.join(dir, builtName(name))
  var featuresFilename = path.join(dir, featuresName(name))
  var compiledFilename = path.join(dir, compiledName(name))

  return {
    built: builtFilename,
    features: featuresFilename,
    compiled: compiledFilename
  }
}

module.exports = {
  bundleName: bundleName,
  builtName: builtName,
  featuresName: featuresName,
  compiledName: compiledName,
  getFirstLine: getFirstLine,
  isHashbang: isHashbang,
  removeFirstLine: removeFirstLine,
  restoreFirstLine: restoreFirstLine,
  finishWithEndline: finishWithEndline,
  finishTextWithEndline: finishTextWithEndline,
  formFilenames: formFilenames
}
