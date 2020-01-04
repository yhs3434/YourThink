const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const koa = require('koa');
const Router = require('koa-router');

const app = new koa();
const router = new Router();

const api = require('./api');


// config

const config = {
    domain: 'unknown.com',
    http: {
      port: 3001,
    },
    https: {
      port: 3002,
      options: {
        key: fs.readFileSync(path.resolve(process.cwd(),'certs/privkey.pem'), 'utf8').toString(),
        cert: fs.readFileSync(path.resolve(process.cwd(), 'certs/fullchain.pem'), 'utf8').toString(),
      },
    },
  };

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

// 라우트 하위 경로 설정

router.use('/api', api.routes());



// router set

app.use(router.routes()).use(router.allowedMethods());


http.createServer(app.callback()).listen(config.http.port);
https.createServer(config.https.options, app.callback()).listen(config.https.port);