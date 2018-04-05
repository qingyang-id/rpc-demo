/**
 * @description 返回对象类
 * @author      yq
 * @date        2018-01-30 23:03:21
 */
const ErrorInfo = require('../constants/errorInfo');
const ErrorCode = require('../constants/errorCode');

class BaseResponse {
  constructor(code, message, data) {
    this.code = code;
    this.message = message || ErrorInfo[code] || '系统错误';
    this.data = data;
  }

  /**
   * 创建返回信息
   *
   * @param {Number} code 状态码
   * @param {String} message 描述
   * @param {Object} [data] 返回数据信息
   *
   * @returns {BaseResponse}
   * @public
   */
  static create(code, message, data) {
    return new BaseResponse(code, message, data);
  }

  /**
   * 深度克隆返回信息
   *
   * @returns {BaseResponse}
   * @public
   */
  clone() {
    return new BaseResponse(this.code, this.message, this.data);
  }
  setCode(code) {
    this.code = code;
    return this;
  }
  getCode() {
    return this.code;
  }
  setMessage(message) {
    this.message = message;
    return this;
  }
  getMessage() {
    return this.message;
  }
  setData(data) {
    this.data = data;
    return this;
  }
  getData() {
    return this.data;
  }
}

BaseResponse.SUCCESS = BaseResponse.create(ErrorCode.SUCCESS);
BaseResponse.ERR_SERVER = BaseResponse.create(ErrorCode.ERR_SERVER);

module.exports = BaseResponse;

