// ES feature names from https://github.com/getify/es-feature-tests
// List of Babel plugins https://babeljs.io/docs/plugins/
var INCLUDE_BABEL_POLYFILL = 'INCLUDE_BABEL_POLYFILL'

var babelMapping = {
  letConst: 'transform-es2015-block-scoping',
  templateString: 'transform-es2015-template-literals',
  arrow: 'transform-es2015-arrow-functions',
  parameterDestructuring: ['transform-es2015-parameters', 'transform-es2015-destructuring'],
  numericLiteral: 'transform-es2015-literals',
  spreadRest: 'transform-es2015-spread',
  conciseMethodProperty: 'transform-es2015-shorthand-properties',
  destructuring: 'transform-es2015-destructuring',
  INCLUDE_BABEL_POLYFILL: INCLUDE_BABEL_POLYFILL
};

['StringMethods', 'ArrayMethods'].forEach(function (feature) {
  babelMapping[feature] = INCLUDE_BABEL_POLYFILL
})

module.exports = babelMapping
