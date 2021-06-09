import googleIt from 'google-it-safesearch'
import qaPkg from "question-answering";
const { QAClient } = qaPkg;
import unfluff from 'unfluff'
import fetch from 'node-fetch'
import readline from 'readline'
const lineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
import Google from 'googleapis'
const { google } = Google
const customsearch = google.customsearch('v1')
import { colors } from './console-colors.js'
import { isNull } from 'util';

import {Filter} from './profanity-filter.js'

let filter = new Filter()
filter.loadDefault()

/// LOLLLL: poop!!!! | why am i going insane?!?!?!
// Examples: 
// who are the beatles?
// when was abraham lincoln president OR who was president in 1861
// what is dogecoin?
// what is scratch
// when do you put icing on cake?
// how to become famous
// why am i going insane!??!?!
// how rich is amazon ceo
// What should i eat for breakfast today?
// where is district 13 in the hunger games
// what spell does harry use to fight off the dementors
// will scratch 4.0 come out


// Proxy list: https://www.freeproxylists.net/

//////////////////////// CONFIG ///////////////////////
let SCORE_THRESH = 0.1

let VAR_LEN = 256
let MAX_LEN = 256 * 2

///////////////////////////// INIT ///////////////////////////

let qaClient = null

export async function init() {
    qaClient = await QAClient.fromOptions();
}

const beeMovieLolllll = "According to all known laws of aviation, there is no way a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway because bees don't care what humans think is impossible. Yellow, black. Yellow, black. Yellow, black. Yellow, black. Ooh, black and yellow! Let's shake it up a little."

let custom = {
    "hello there": "Obi Wan",
    "bee movie": beeMovieLolllll.substring(0,50),
    "bee movie script": beeMovieLolllll.substring(0,50),
    // "hello": "ask a QUESTION! you silly!",
    "who is joe": "joe MAMA!!!!",
    "who is griffpatch": "a billionare doge scratch tycoon!!!!",
    "who is ceebee": "a member of the Scratch Team and a Gryffindor",
    "who is gobello": "ilhp10's first follower and a darn cool dude",
    "should i follow ilhp1": 'Yes. Definitely. Do it!!'
}

const googleOpts = {
    cx: '098304df77266988c',
    auth: 'AIzaSyAl12zrpcuK5cfiERNR9yigK3mzs1VTg1k'
}

const options = {
    // 'limit': '1'
};

/////////////////////////// SEARCH ///////////////////////////

async function googleSearch(search) {
    // return googleIt({ options, 'no-display': 'true', 'query': search, 'proxy': '62.113.113.155:16286' });
    return googleIt({ options, 'no-display': 'true', 'query': search, 'proxy': '62.113.113.155:16286', 'limit': '2', 'excludeSites': 'youtube.com' });
}

async function googleAPI(search) {
    googleOpts.q = search
    let res = (await customsearch.cse.list(googleOpts)).data
    return res
}
async function getAPISnippet(search) {
    let res = await googleAPI(search)
    return res.items[2].snippet
}

async function duckAbs(search) {
    return (await (await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(search)}&format=json`)).json())["Abstract"]
}

async function getTopUrl(search) {
    let results = await googleSearch(search)
    if (results.length == 0) { return null }
    // console.log(results[0].link)
    return results[0].link
}

async function getTopSiteText(search) {
    const html = await (await fetch(await getTopUrl(search))).text()
    console.log("WEBSITE DOWNLOAEDED!")
    return unfluff.lazy(html, 'en').text()
}
async function getTopSitePreview(search) {
    let results = await googleSearch(search)
    if (results.length == 0) { return null }
    // console.log(results[0].link)
    return results[results.length - 1].snippet
}
async function getBottomSitePreview(search) {
    let results = await googleSearch(search)
    if (results.length < 1) { return null }
    // console.log(results[0].link)
    return results[0].snippet
}

export async function getAnswer(question) {

    let qTrimmed = question.toLowerCase().split('?').join('') 
    if(qTrimmed in custom) {
        return custom[qTrimmed]
    }

    let ans = null
    // let text = await getAPISnippet(question)
    // let text = await getBottomSitePreview(question)

    let results = await googleSearch(question)
    console.log(results)
    console.log('results length: ' + results.length)
    if (results.length < 1) { return 'Answer could not be found.' }
    // console.log(results[0].link)
    let text = results[0].snippet

    if (text == null) {
        ans = "Answer could not be found."
    } else {
        // let text = await getTopSiteText(question)
        text = text.substring(0, Math.min(5000, text.length))
        // console.log(text)
        let result = await qaClient.predict(question, text)
        console.log(result)
        //ALTERNATIVE ANSWER
        if (result.score <= SCORE_THRESH) {
            if (results.length >= 2) {
                console.log('getting alternative ans')
                result = await qaClient.predict(question, results[1].snippet)
                console.log(result)
            }
            if (result.score <= SCORE_THRESH) { result = { text: results[0].snippet.substring(0, Math.min(50, results[0].snippet.length)) + '...' } }
        }
        ans = result.text
    }

    console.log(`Question: ${colors.fgBlack + colors.bgWhite}${question}${colors.reset} | Answer: ${colors.fgBlack + colors.bgWhite}${ans}${colors.reset}`)    
    return ans;
}

export async function getAnswerFiltered(question) {
    if (filter.isVulgar(question)) {
        return 'Answer could not be found.'
    }
    let answer = await getAnswer(question)
    if (filter.isVulgar(answer)) {
        return 'Answer could not be found.'
    } else {
        return answer
    }
}



///////////////////////// RUN ///////////////////////////


async function startQuestioning() {
    lineInterface.question('Enter a search?\n', async (input) => {
        if (input == 'exit') {
            lineInterface.close();
        } else {
            console.log(await getAnswer(input));
            startQuestioning();
        }
    });
}

async function run() {

    await init()


    startQuestioning()
    // console.log(await googleAPI('who made scratch'))
}

// run()
