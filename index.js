import Scratch from 'scratch-api'
import fs from 'fs'
import fetch from 'node-fetch'
import { init, getAnswerFiltered } from './googleit.js'
// import {Filter} from './profanity-filter.js'

// let filter = new Filter()
// filter.loadDefault()

const info = { username: 'cs108426', password: '40sandstone', projectId: '537953417' }
const VAR_LENGTH = 256;
const chars = fs.readFileSync('chars.txt').toString().split("\r\n");


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

String.prototype.replaceAt = function (index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}


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


async function startListening() {
    await init()
    Scratch.UserSession.create(info.username, info.password, async (err, user) => {
        console.log('User session started')
        user.cloudSession(info.projectId, async (err, sess) => {

            let resSlot = 0

            console.log('Cloud session started')
            sess.on('set', async (name, val) => {
                try {
                    console.log(`variable set- name: ${name}, val: ${val}`)
                    if (name == '☁ req') {
                        if (val.length >= 4) {
                            const requestId = val.substr(0, 4)
                            const question = decode(val.substr(4, val.length))
                            console.log('Question recieved: ' + question)
                            let answer = await getAnswerFiltered(question)
                            console.log('Answer is: ' + answer)
                            answer = answer.substr(0, Math.min(answer.length, (VAR_LENGTH - 4) / 2))
                            resSlot = (resSlot + 1) % 2
                            let varName = '☁ res' + resSlot
                            sess.set(varName, requestId + encode(answer))
                            console.log('Answer set on ' + varName)
                        }
                    }
                } catch (err) { console.log('BEEP BEEP ERROR!!! ' + err) }
            })

        })
    })
}

startListening()