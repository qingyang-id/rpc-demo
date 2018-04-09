/**
 * @description 请求数据处理工具类
 * @author yq
 * @date 2017/7/16 上午10:14
 */
const BaseResponse = require('../baseResponse');
const Logger = require('log4js').getLogger('rpc-request');

class RequestUtil {
  /**
   * 请求参数格式化
   * @param opts
   * @returns {exports.ThriftRequest}
   */
  static formatParams(opts) {
    const options = opts || {};
    const request = {
      params: options.params || {},
      session: options.session || {}
    };
    return { request: JSON.stringify(request) };
  }

  /**
   * 返回参数格式化
   * @param err
   * @param result
   * @returns {*}
   */
  static async formatResponse(err, result) {
    if (err) throw err;
    if (!result) throw BaseResponse.create(500, '请求无响应，请稍后重试');
    let data;
    if (result.data) {
      try {
        data = JSON.parse(result.data);
      } catch (err1) {
        Logger.error(`处理rpc返回信息(${result})失败`, err1.stack || err1);
      }
    }
    if (result.code !== 0) {
      throw BaseResponse.create(result.code || 500, result.message || '请求失败，请稍后重试', data);
    }
    return BaseResponse.SUCCESS.setData(data);
  }
}

module.exports = RequestUtil;
