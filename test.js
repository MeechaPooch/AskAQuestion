import {Filter} from './profanity-filter.js'

let c = new Filter()
c.loadDefault()

console.log(c.isVulgar('what is the most safe country'))
console.log(c.compressor.compress('prejudice'))