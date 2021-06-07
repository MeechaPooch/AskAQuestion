import {Filter} from './profanity-filter.js'

let c = new Filter()
c.loadDefault()

console.log(c.isVulgar('cing '))
console.log(c.compressor.compress('cing '))