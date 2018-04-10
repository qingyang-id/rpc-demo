/**
 * @description http请求工具类
 * @author yq
 * @date 2018/4/10 下午4:32
 */
const HttpUtil = require('../../../utils/httpUtil');
const RpcClientPool = require('./rpcClientPool');
const BaseResponse = require('../../baseResponse');

class Rpc {
  /**
   * 构造方法
   * @param {String} rpcName 服务名称
   * @param {String} method 请求方法
   * @param {String} path 请求路径
   */
  constructor({ rpcName, method, path }) {
    // thrift名称 例如：admin
    this.rpcName = rpcName;
    // thrift service名称 例如：AdminService
    this.method = method;
    // path 具体操作方法名称 例如：doLogin
    this.path = path;
  }

  async invoke(options) {
    const that = this;
    const startTime = Date.now();
    console.info(`请求信息，rpc服务：${that.rpcName}，method: ${that.method}, path: ${that.path}, 参数:`, options);
    const { host } = await RpcClientPool.getInstance().getClient(that.rpcName);
    // 调用具体的服务方法
    // http请求count接口
    return HttpUtil.send(Object.assign(options, {
      url: `${host}${this.path}`,
      method: this.method,
      json: true
    }))
      .then(({ body }) => {
        if (!body) {
          console.error(that.method, that.path, '失败：请求结束，耗时：', Date.now() - startTime);
          throw BaseResponse.create(500, '请求http接口失败');
        }
        if (body.code !== 0) {
          console.error(that.method, that.path, '失败：请求结束，耗时：', Date.now() - startTime);
          throw BaseResponse.create(body.code, body.message, body.data);
        }
        console.info(that.method, that.path, '成功：请求结束，耗时：', Date.now() - startTime);
        return BaseResponse.SUCCESS.clone().setData(body.data);
      });
  }
}

module.exports = Rpc;
