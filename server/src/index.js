const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser')
const session = require('koa-session');
const dotenv = require('dotenv');

const app = new koa();
const router = new Router();

// env set

dotenv.config();

// config

const HTTP_CONFIG = {
  domain: 'unknown.com',
  http: {
    port: process.env.HTTP_PORT,
  },
  https: {
    port: process.env.HTTPS_PORT,
    options: {
      key: fs.readFileSync(path.resolve(process.cwd(),'certs/privkey.pem'), 'utf8').toString(),
      cert: fs.readFileSync(path.resolve(process.cwd(), 'certs/fullchain.pem'), 'utf8').toString(),
    },
  },
};

const SESSION_CONFIG = {
  key: process.env.COOKIE_SIGN_KEY, /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};

// router set

app.use(bodyParser()).use(router.routes()).use(router.allowedMethods());

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

// session

/* app.use(session(SESSION_CONFIG, app)); */

// 라우트 하위 경로 설정

const api = require('./routes/api.js');
const auth = require('./routes/auth.js');

router.use('/api', api.routes());
router.use('/auth', auth.routes());


// server listen

http.createServer(app.callback()).listen(HTTP_CONFIG.http.port);
https.createServer(HTTP_CONFIG.https.options, app.callback()).listen(HTTP_CONFIG.https.port);