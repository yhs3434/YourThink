const mysql = require('mysql');
const conn = mysql.createConnection(require('./config/mysqlConfig'));
conn.connect();

const wsLib = require('./lib/websocket');
const mysqlLib = require('./lib/mysql');

// library import
const datetimeToJs = require('./lib/mysql');

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
    console.log(`${req.connection.remoteAddress} is connected`);
    ws.on('message', function incoming(res) {
        const {type, payload} = wsLib.decodeFromJs(res);
        if (type === 'init') {

        } else if (type === 'save') {
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
        } else if (type === 'public') {
            const {memoTitle, memoContent, published, modified} = payload;
            const query = `
                INSERT INTO public_memo SET memoTitle = ?, memoContent = ?, published = ?, modified = ?
            `
            conn.query(query, [memoTitle, memoContent, published, modified], (err, rows, fields) => {
                if (!err) {
                    ws.send(wsLib.encodeToJs('success'));
                } else {
                    console.error(err);
                    ws.send(wsLib.encodeToJs('error'));
                }
            })
        } else if (type === 'publicGet') {
            const weekOffset = 4;
            const query = `
                SELECT * from (SELECT memoTitle, memoContent, published, modified FROM public_memo
                     WHERE publiced BETWEEN date_add(now(), interval -${weekOffset} week) and now()
                    ) as m;
            `;
            conn.query(query, (err, rows, fields) => {
                for (row of rows) {
                    // 이미 본 거 분류
                }

                const retRow = rows[Math.floor(Math.random() * rows.length)];
                ws.send(wsLib.encodeToJs(retRow));
                ws.send('close');
            });
        } else if (type === 'getMine') {
            const {userId, platform} = payload;
            const token = `${platform}${userId}`;
            console.log('token', token);
            const query = `
                SELECT memoTitle, memoContent, published, saved
                FROM memo 
                WHERE memoId LIKE "${token}%" 
                ORDER BY saved ASC;
            `
            conn.query(query, (err, rows, fields) => {
                for (let row of rows) {
                    ws.send(wsLib.encodeToJs(row));
                }
                ws.send(wsLib.encodeToJs('close'));
            });
        } else if (type === 'getYours') {
            const {userId, platform} = payload;
            const token = `${platform}${userId}`;
            const query = `
                SELECT memoTitle, memoContent, published, saved
                FROM public_save 
                WHERE memoId LIKE "${token}%"
                ORDER BY saved ASC;
            `;
            conn.query(query, (err, rows, fields) => {
                for (let row of rows) {
                    ws.send(wsLib.encodeToJs(row));
                }
                ws.send(wsLib.encodeToJs('close'));
            });
        } else if (type === 'saveYours') {
            const {memoId, memoTitle, memoContent, published} = payload;
            const query = `
                INSERT INTO public_save 
                SET memoId = ?, memoTitle = ?, memoContent = ?, published = ?;
            `
            const params = [memoId, memoTitle, memoContent, published];
            conn.query(query, params, (err, rows, fields) => {
                if (!err) {
                    ws.send(wsLib.encodeToJs('close'));
                } else {
                    console.log('err', err.errno);
                    if (err.errno === 1062) {
                        ws.send(wsLib.encodeToJs('duplicate'));
                    } else {
                        ws.send(wsLib.encodeToJs('error'));
                    }
                }
            })
        }
    })
})