/**
 * @description http业务逻辑
 * @author yq
 * @date 2018/4/10 下午4:29
 */
const Rpc = require('./rpc');
const BaseResponse = require('../../baseResponse');
const { apiConfig } = require('../../../config/index').httpConfig;


/**
 * 本地负载均衡接口逻辑
 *
 * @param  {Object}   ctx  请求结构体
 * @param  {Function} next 回调
 */
module.exports.rpcLogic = async (ctx, next) => {
  const apiKey = `${ctx.method}_${ctx.path}`.toLocaleLowerCase();
  const serviceInfo = apiConfig[apiKey];
  // 匹配路径参数 todo
  if (serviceInfo) {
    const opts = {};
    if (ctx.query) opts.query = ctx.query;
    if (ctx.body) opts.body = ctx.body;
    // http请求count接口
    return new Rpc(serviceInfo).invoke(opts)
      .then((result) => {
        // 是否需要重定向
        ctx.body = result;
      });
  }
  return next();
};
