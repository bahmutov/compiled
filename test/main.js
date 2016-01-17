// main.js
import { add } from './calc'
const a = 10
const b = 2
Promise.resolve(add(a, b))
  .then(function (sum) {
    console.log(`${a} + ${b} = ${sum}`)
  })
