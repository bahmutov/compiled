// main.js
import { add } from './calc'
const a = 10
const b = 2
Promise.resolve(add(a, b))
  .then(function (sum) {
    console.log(`${a} + ${b} = ${sum}`)
  })

const objectAdd = ({a, b}) => a + b
console.log('Adding object properties', objectAdd({ a: 10, b: 2 }))

console.log('binary literal', 0b101)

// spread rest support
var params = ['hello', true, 7]
var other = [1, 2, ...params] // [ 1, 2, 'hello', true, 7 ]
console.assert(other.length === 5, 'spread / rest not working')

// object properties
const foo = 'foo'
const bar = 'bar'
const o = {foo, bar}
console.log(`object ${o.foo} and ${o.bar}`)

// destructuring assignment
var list = [1, 2, 3]
var [first, , third] = list
console.assert(first === 1, 'first element')
console.assert(third === 3, 'third element')

// TODO detect string repeat
// string repeat
const foo3 = 'foo'.repeat(3)
console.assert(foo3 === 'foofoofoo', 'string repeat')
