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