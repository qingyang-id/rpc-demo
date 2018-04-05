/**
 * @description 请求数据处理工具类
 * @author yq
 * @date 2017/7/16 上午10:14
 */
const ThriftRequest = require('./js/gen-nodejs/ThriftRequest_types');
const BaseResponse = require('../../baseResponse');
const Logger = require('log4js').getLogger(__dirname);

class RequestUtil {
  /**
   * 请求参数格式化
   * @param opts
   * @returns {exports.ThriftRequest}
   */
  static formatParams(opts) {
    const options = opts || {};
    const requestData = {
      params: options.params || {},
      session: options.session || {}
    };
    Object.keys(requestData.params).forEach((k) => {
      // if ({}.hasOwnProperty.call(requestData.params, k)) {
      requestData.params[k] = requestData.params[k] || '';
      if (['array', 'object'].includes(typeof requestData.params[k])) {
        requestData.params[k] = JSON.stringify(requestData.params[k]);
      } else {
        requestData.params[k] = requestData.params[k].toString();
      }
      // }
    });
    Object.keys(requestData.session).forEach((k) => {
      // if ({}.hasOwnProperty.call(requestData.session, k)) {
      requestData.session[k] = requestData.session[k] || '';
      if (['array', 'object'].includes(typeof requestData.session[k])) {
        requestData.session[k] = JSON.stringify(requestData.session[k]);
      } else {
        requestData.session[k] = requestData.session[k].toString();
      }
      // }
    });
    return new ThriftRequest.ThriftRequest(requestData);
  }

  /**
   * 返回参数格式化
   * @param err
   * @param result
   * @returns {*}
   */
  static async formatResponse(err, result) {
    if (err) throw err;
    let data;
    if (result) {
      try {
        data = JSON.parse(result);
      } catch (err1) {
        Logger.error(`处理rpc返回信息(${result})失败`, err1.stack || err1);
      }
    }
    if (!data) throw BaseResponse.create(500, '请求无响应，请稍后重试');
    if (data.code !== 0) {
      throw BaseResponse.create(data.code || 500, data.message || '请求失败，请稍后重试');
    }
    return BaseResponse.SUCCESS.setData(data.data);
  }
}

module.exports = RequestUtil;
