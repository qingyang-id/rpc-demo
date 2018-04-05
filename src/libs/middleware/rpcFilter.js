/**
 * @description rpc 中间件
 * @author      yq
 * @date        2017-11-27 16:40:32
 */
const BaseResponse = require('../baseResponse');
const Logger = require('log4js').getLogger('middleware.rpcFilter');

/**
 * rpc 请求前置中间件
 *
 * @param  {Object}   err    错误信息
 * @param  {Object} next   回调方法
 */
module.exports.beforeFilter = (opts, next) => {
  if (!opts || !opts.params || !opts.session) {
    return next({
      code: -1,
      msg: '请求参数错误'
    });
  }
  return next();
};

/**
 * rpc 返回信息后置中间件
 *
 * @param  {Object}   err    错误信息
 * @param  {Object}   result 返回data信息
 * @param  {Object} next   回调方法
 */
module.exports.afterFilter = (err, result, next) => {
  if (err) {
    if (err instanceof BaseResponse) {
      Logger.debug('请求失败：', err);
      return next(JSON.stringify(err));
    }
    const msg = (process.NODE_ENV !== 'production' && err.message) ? err.message : '请求失败，请稍后重试';
    Logger.error('请求失败：', err.stack || err);
    return next(JSON.stringify(BaseResponse.ERR_SERVER.clone().setMessage(msg)));
  }
  return next(null, JSON.stringify(BaseResponse.SUCCESS.clone().setData(result)));
};
