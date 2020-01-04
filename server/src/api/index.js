const Router = require('koa-router');

const api = new Router();

api.get('/hello', (ctx, next) => {
    ctx.response.body = 'hello!!';
});

module.exports = api;