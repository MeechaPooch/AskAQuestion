import googleIt from 'google-it'
import fetch from 'node-fetch'

async function google(search) {
    const options = {
        'limit': '1'
    };
    return googleIt({ options, 'no-display': '', 'query': search, 'proxy': '62.113.113.155:16286' });
}

async function duckAbs(search) {
    return (await (await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(search)}&format=json`)).json())["Abstract"]
}

async function run() {
    console.log('starting...')
    for (let i = 0; i < 100; i++) {
        console.log(await google("who were the beatles"))
        console.log(i)
    }

    // console.log(await duckAbs("who is rumi"))
}

run();