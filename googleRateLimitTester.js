import googleIt from 'google-it'
// import fetch from 'node-fetch'

async function google(search) {
    const options = {
        // 'proxy': '139.9.133.196:808',
        // 'proxy': 'https://62.113.113.155:16286',
        // 'proxy': 'https://178.128.61.67:8080',
        proxy: 'http://68.183.54.155:8080',
        // proxy: 'http://174.138.27.47:8080',
        // proxy: 'http://69.160.6.142:3128',
        diagnostics: true
    };
    return googleIt({ options, 'no-display': '', 'query': search, diagnostics: true });
    // return googleIt({ options, 'no-display': '', 'query': search, 'proxy': '62.113.113.155:16286' });
}

async function duckAbs(search) {
    return (await (await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(search)}&format=json`)).json())["Abstract"]
}

async function run() {
    console.log('starting...')
    for (let i = 0; true; i++) {
        console.log(await google("who were the beatles" + Math.random()))
        console.log(i)
    }

    // console.log(await duckAbs("who is rumi"))
}

run();