/**
 * @description grpc 请求工具类
 * @author yq
 * @date 2017/7/15 下午4:37
 */
const RpcClientPool = require('./rpcClientPool');
const RequestUtil = require('../requestUtil');
const BaseResponse = require('../../baseResponse');

class Rpc {
  /**
   * 构造方法
   * @param {String} rpcName thrift名称
   * @param {String} serviceName thrift服务名称
   * @param {String} actionName 方法名称
   */
  constructor({ rpcName, serviceName, actionName }) {
    // thrift名称 例如：admin
    this.rpcName = rpcName;
    // thrift service名称 例如：AdminService
    this.serviceName = serviceName;
    // actionName 具体操作方法名称 例如：doLogin
    this.actionName = actionName;
  }

  async invoke(options) {
    const that = this;
    const startTime = Date.now();
    console.info(`请求信息，rpc服务：${that.rpcName}，serviceName: ${that.serviceName}, actionName: ${that.actionName}, 参数:`, options);
    const client = await RpcClientPool.getInstance().getClient(that.rpcName, that.serviceName);
    if (typeof client[this.actionName] !== 'function') {
      throw BaseResponse.create(-99, `方法${this.actionName}不存在(thrift名称:${this.thriftName},服务名称:${this.serviceName})`);
    }
    // 调用具体的服务方法
    return new Promise((resolve, reject) => {
      client[that.actionName](RequestUtil.formatParams(options), (error, result) => {
        // 异步修改clientCount
        RpcClientPool.getInstance().release({
          rpcName: this.rpcName,
          host: client.host,
        });
        return RequestUtil.formatResponse(error, result)
          .then((data) => {
            console.info(that.serviceName, that.actionName, '成功：请求结束，耗时：', Date.now() - startTime);
            resolve(data);
          })
          .catch((error1) => {
            console.error(that.serviceName, that.actionName, '失败：请求结束，耗时：', Date.now() - startTime);
            reject(error1);
          });
      });
    });
  }
}

module.exports = Rpc;
