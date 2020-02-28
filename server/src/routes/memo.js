const Router = require('koa-router');
const mysql = require('sync-mysql');
const dbconfig = require('../database/config.js');
let conn = new mysql(dbconfig);
const crypto = require('crypto');

const router = new Router();

router.post('/save', async(ctx, next) => {
    const {memoContent, memoImage} = ctx.request.body;

    try {
        const query = `INSERT INTO mymemo (memoContent, memoImage) values ('${memoContent}', '${memoImage}')`;
        const rows = await conn.query(query);

        ctx.response.status = 200;
        ctx.response.body = {
            result: true
        }
    } catch (err) {
        ctx.response.status = 400;
        ctx.response.body = {
            result: false
        };
    }
})

/*
data = {
    'memoContent': '~~~~~~~~~~',
    'memoImage': '이미지 파일 Blob 형식인데, 텍스트로 넣거나 null인 상태로 보내도 무관'
}
*/

module.exports = router;