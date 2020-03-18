const mysql = require('mysql');
const conn = mysql.createConnection(require('./config/mysqlConfig'));
conn.connect();

const WebSocket = require('ws');

let wsHash = {}

const wss = new WebSocket.Server({
    port: 8080,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});

wss.on('connection', function connection(ws, req) {
    ws.on('message', function incoming(res) {
        const {type, payload} = JSON.parse(unescape(res));
        switch (type) {
            case 'init':
                break;

            case 'save':
                //console.log(type, payload);
                const {memoId, memoTitle, memoContent, published} = payload;
                const query = `
                INSERT INTO memo SET memoId = ?, memoTitle = ?, memoContent = ?, published = ?
                `
                conn.query(query, [memoId, memoTitle, memoContent, published],(err, rows, fields) => {
                    if (!err) {
                        ws.send('success');
                    } else {
                        console.error(err);
                        ws.send('fail');
                    }
                })
                break;

            case 'test':
                conn.query('select * from memo', (err, rows, fields) => {
                    if (!err) {
                        console.log(rows[0]);
                        console.log(rows[0].memoTitle);
                    }
                })
                break;
                
            default:
                console.log('default');
        }
    })

    ws.send('something');
})