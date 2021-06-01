let resSlot = 0

for (let i = 0; i < 10; i++) {
    console.log(resSlot)
    resSlot = (resSlot+1)%2
}

import fs from 'fs'
const chars = fs.readFileSync('chars.txt').toString().split("\r\n");

function encode(value) {
    let ret = '';
    [...value].forEach(c => { ret = ret + ('0' + (chars.indexOf(c) + 1)).slice(-2) })
    return ret
}
function decode(encoded) {
    let ret = ''
    let nums = encoded.match(new RegExp('.{1,' + 2 + '}', 'g'));
    [...nums].forEach(n => { ret = ret + chars[n - 1] })
    return ret
}

console.log(decode(encode('hello world!!!!!(*#&%(#@~!')))