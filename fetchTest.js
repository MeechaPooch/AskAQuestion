import fetch from 'node-fetch'

(async ()=>{
let req = fetch('https://yandex.com/search/xml?user=goooooooosee&key=03.1430045853:751f2151f1c211d8ab142f1869a5c477&query=yandex&l10n=en&sortby=tm.order%3Dascending&filter=none&groupby=attr%3D%22%22.mode%3Dflat.groups-on-page%3D10.docs-in-group%3D1')
let res = await (await req).text()
console.log(res)
})()