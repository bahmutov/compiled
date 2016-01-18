'use strict';

// calc.js
const add = (a, b) => a + b

const a = 10
const b = 2
Promise.resolve(add(a, b))
  .then(function (sum) {
    console.log(`${a} + ${b} = ${sum}`)
  })

const objectAdd = ({a, b}) => a + b
console.log('Adding object properties', objectAdd({ a: 10, b: 2 }))

console.log('binary literal', 0b101)
