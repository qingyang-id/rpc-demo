/**
 * @description rpc 中间件
 * @author      yq
 * @date        2017-11-27 16:40:32
 */
const BaseResponse = require('../baseResponse');
const Logger = require('../../utils/logger').getLogger('middleware.rpcFilter');

/**
 * rpc 请求前置中间件
 *
 * @param  {Object}   err    错误信息
 * @param  {Function} next   回调方法
 */
module.exports.beforeFilter = (opts, next) => {
  if (!opts || !opts.request) {
    return next(BaseResponse.create(-1, '请求参数错误'));
  }
  if (typeof opts.request === 'string') {
    // thrift
    opts.request = JSON.parse(opts.request);
  } else {
    // grpc
    if (!opts.request.request) return next(BaseResponse.create(-1, '请求参数错误'));
    opts.request = JSON.parse(opts.request.request);
  }
  return next();
};

/**
 * rpc 返回信息后置中间件
 *
 * @param  {Object}   err    错误信息
 * @param  {Object}   result 返回data信息
 * @param  {Function} next   回调方法
 */
module.exports.afterFilter = (err, result, next) => {
  if (err) {
    if (err instanceof BaseResponse) {
      Logger.debug('请求失败：', err);
      if (err.data && typeof err.data === 'object') {
        err.setData(JSON.stringify(err.data));
      }
      return next(err);
    }
    const msg = (process.NODE_ENV !== 'production' && err.message) ? err.message : '请求失败，请稍后重试';
    Logger.error('请求失败：', err.stack || err);
    return next(BaseResponse.ERR_SERVER.clone().setMessage(msg));
  }
  const baseResponse = BaseResponse.SUCCESS.clone();
  if (typeof result === 'object') {
    baseResponse.setData(JSON.stringify(result));
  } else if (result) {
    baseResponse.setData(result);
  }
  console.log('回调：', baseResponse);
  return next(null, baseResponse);
};
