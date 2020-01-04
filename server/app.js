const http = require('http');
const https = require('https');
const koa = require('koa');
const router = require('koa-router');
const app = new koa();
const _ = router();

// logger

app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(async (ctx) => {
    console.log('hello');
    console.log(ctx)
    ctx.response.body = "hello world!";
})

http.createServer(app.callback()).listen(3001);
https.createServer(app.callback()).listen(3002);