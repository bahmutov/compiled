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