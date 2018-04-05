/**
 * @description 请求处理中间件
 * @author yq
 * @date 2018/4/4 下午3:12
 */
const crypto = require('crypto');

module.exports = async function (ctx, next) {
  const start = Date.now();
  ctx.reqId = crypto.randomBytes(12).toString('hex');
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}`);
};
