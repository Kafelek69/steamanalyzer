const http = require('http');
http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            console.log('--- UI ERROR RECEIVED ---');
            console.log(body);
            res.writeHead(200, { 'Access-Control-Allow-Origin': '*' });
            res.end();
        });
    } else {
        res.writeHead(200, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*' });
        res.end();
    }
}).listen(5001);
console.log('Listening for errors on 5001...');
