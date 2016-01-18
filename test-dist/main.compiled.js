'use strict';

// calc.js

var add = function (a, b) {
  return a + b;
};

var a = 10;
var b = 2;
Promise.resolve(add(a, b)).then(function (sum) {
  console.log(a + ' + ' + b + ' = ' + sum);
});

var objectAdd = function (_ref) {
  var a = _ref.a;
  var b = _ref.b;
  return a + b;
};
console.log('Adding object properties', objectAdd({ a: 10, b: 2 }));

console.log('binary literal', 5);

// spread rest support
var params = ['hello', true, 7];
var other = [1, 2].concat(params); // [ 1, 2, 'hello', true, 7 ]
console.assert(other.length === 5);
