import {Filter} from './profanity-filter.js'

let c = new Filter()
c.loadDefault()


// console.log(c.tester.words)


// c.addWord('fuck')
// c.addWord('sex')
// c.addWord('boobs')
// c.addWord('vegana')
// c.addWord('vegina')
// c.addWord('bitcc')
// c.addWord('fuck')

console.log(c.isVulgar('continent'))
console.log(c.isVulgar('con'))
console.log(c.compressor.compress('continent'))