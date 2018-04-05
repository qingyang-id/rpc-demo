/**
 * @description 错误处理中间件
 * @author yq
 * @date 2018/4/4 下午2:36
 */
const BaseResponse = require('../baseResponse');

module.exports = async function (ctx, next) {
  try {
    await next();
    if (ctx.status >= 400) ctx.throw(ctx.status);
  } catch (err) {
    console.error('失败：', err);
    if (err instanceof BaseResponse) {
      ctx.body = err;
      return;
    }
    console.log('status---', ctx.status, typeof ctx.status);
    if (ctx.status === 404) {
      ctx.body = BaseResponse.create(404, 'Not Found');
    }
    const code = (err.statusCode || err.status) || 500;
    const message = ctx.app.env !== 'production' ? err.message : '请求失败，请稍后重试';
    ctx.body = BaseResponse.create(code, message);
  }
};
