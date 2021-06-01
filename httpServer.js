import { init, getAnswer } from './googleit.js'
import http from 'http'


async function run() {
    await init()

    var server = http.createServer(async (req, res)=>{

        let data = '';

        req.on('data', chunk => {
            data += chunk;
        })

        req.on('end', async () => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            let ans = await getAnswer(data);
            if(typeof ans == 'string') {
                res.write(ans);
            } else {
                res.write('error!')
            }
            res.end();
        })
    })

    server.listen(3000)


    // console.log(await getAnswer('who is the pink panter?'))
}

run()