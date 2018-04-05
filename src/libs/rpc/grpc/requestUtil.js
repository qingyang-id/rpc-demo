/**
 * @description 请求数据处理工具类
 * @author yq
 * @date 2017/7/16 上午10:14
 */
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
    return JSON.stringify(requestData);
  }

  /**
   * 返回参数格式化
   * @param err
   * @param result
   * @returns {*}
   */
  static async formatResponse(err, result) {
    console.log(err, result);
    if (err) throw err;
    let data;
    if (result && result.response) {
      try {
        data = JSON.parse(result.response);
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
