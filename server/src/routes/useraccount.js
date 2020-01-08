const Router = require('koa-router');
const mysql = require('sync-mysql');
const dbconfig = require('../database/config.js');
let conn = new mysql(dbconfig);

const ua = new Router();

ua.post('/signup', async (ctx, next) => {
    const {uname, pwd, pwd_chk, email} = ctx.request.body;
    if (pwd != pwd_chk) {
        ctx.response.status = 400;
        console.log('test');
    } else {
        ctx.response.status = 200;
        ctx.response.body = 'good';
    }
})

module.exports = ua;