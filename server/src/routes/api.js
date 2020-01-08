const Router = require('koa-router');
const mysql = require('sync-mysql');
const dbconfig = require('../database/config.js');
let conn = new mysql(dbconfig);

const api = new Router();

api.get('/hello', async (ctx, next) => {
    ctx.response.body = 'hello!!';
    await next();
});

api.get('/db', async (ctx, next) => {
    let rows = conn.query('select * from useraccount;');
    ctx.response.body = rows;
    await next();
});

module.exports = api;