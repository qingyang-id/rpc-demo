/**
 * @description 接口业务逻辑中间件
 * @author      yq
 * @date        2018-04-05 14:53:46
 */
const Rpc = require('./rpc');
const { apiConfig } = require('../../../config/index').grpcConfig;


/**
 * 本地负载均衡接口逻辑
 *
 * @param  {Object}   req  请求结构体
 * @param  {Object}   res  返回结构体
 * @param  {Function} next 回调
 */
module.exports.rpcLogic = async (ctx, next) => {
  const apiKey = `${ctx.method}_${ctx.path}`.toLocaleLowerCase();
  const serviceInfo = apiConfig[apiKey];
  // 匹配路径参数 todo
  if (serviceInfo) {
    const options = {
      params: Object.assign({}, ctx.query, ctx.body),
      session: {}
    };
    return new Rpc(serviceInfo)
      .invoke(options)
      .then((result) => {
        // 是否需要重定向
        ctx.body = result;
      });
  }
  return next();
};
