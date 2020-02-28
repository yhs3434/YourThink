const Router = require('koa-router');
const mysql = require('sync-mysql');
const dbconfig = require('../database/config.js');
let conn = new mysql(dbconfig);
const crypto = require('crypto');

const auth = new Router();

function toHash(password) {
    return crypto.createHmac('sha256', process.env.HASH_KEY).update(password).digest('hex');
}

function toSessionKey(userId, password, salt) {
    return toHash(userId + password + salt);
}

auth.post('/signup', async (ctx, next) => {
    console.log(ctx.request.body);
    const {uname, pwd, pwd_chk, email} = ctx.request.body;
    if (pwd != pwd_chk || pwd == undefined || pwd.length<10) {
        ctx.response.status = 400;
        ctx.response.body = {
            signed: false,
            description: 'Password is not correct.'
        };
    } else {
        const pwd_hash = toHash(pwd);
        try {
            const rows = await conn.query(`INSERT INTO useraccount (username, password, email) VALUES ("${uname}", "${pwd_hash}", "${email}");`);
            ctx.response.status = 200;
            ctx.response.body = {
                signed: true
            };
        } catch (err) {
            ctx.response.status = 409;
            console.log(err);
            ctx.response.body= {
                signed: false
            };
        }
    }
})

auth.post('/login', async (ctx, next) => {
    const {uname, pwd} = ctx.request.body;
    const pwd_hash = toHash(pwd);
    try {
        const rows = await conn.query(`SELECT * FROM useraccount WHERE username = '${uname}' and password='${pwd_hash}';`);
        ctx.response.body = rows;
        if (rows.length > 0) {
            row = rows[0];
            uid = row['id']
            try {
                await conn.query('START TRANSACTION;');
                let dRows = await conn.query(`SELECT * FROM auth WHERE uname = '${uname}'`);
                if (dRows.length > 0) {
                    dRows = await conn.query(`DELETE FROM auth WHERE uname = '${uname}'`);
                }
                const salt = Math.floor(Math.random()*64);
                const accessToken = toSessionKey(uid, pwd_hash, salt);
                const rows = await conn.query(`INSERT INTO auth VALUES ('${accessToken}', '${uname}', '${salt}', date_add(current_timestamp, interval 2 week));`);
                await conn.query('COMMIT;');
                ctx.response.status = 200;
                ctx.response.body = {
                    logged: true,
                    accessToken
                };
                ctx.cookies.set('accessToken', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 14 });
            } catch (err) {
                conn.query('ROLLBACK;');
                ctx.response.status = 400;
                ctx.response.body = {
                    logged: false
                };
            }
        } else {
            ctx.response.status = 400;
            ctx.response.body = {
                logged: false
            };
        }
        
    } catch (err) {
        ctx.response.status = 400;
        ctx.response.body = {
            logged: false
        };
    }
})

module.exports = auth;