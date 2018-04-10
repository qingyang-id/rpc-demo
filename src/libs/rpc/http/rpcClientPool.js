/**
 * @description http连接池
 * @author yq
 * @date 2018/4/10 下午4:22
 */
const { rpcs } = require('../../../config/index').httpConfig;
const BaseResponse = require('../../baseResponse');
const Logger = require('../../../utils/logger').getLogger('httpClientPool');

class RpcClientPool {
  constructor() {
    /**
     * httpClient 客户端map集， key为为服务名，如user;
     */
    this.rpcs = {};
    this.init();
  }

  // 静态方法实现懒汉单例模式
  static getInstance() {
    if (!RpcClientPool.instance) {
      RpcClientPool.instance = new RpcClientPool();
    }
    return RpcClientPool.instance;
  }

  /**
   * 初始化grpc服务信息
   */
  init() {
    // 初始化grpc连接池信息
    rpcs.forEach(({ rpcName, host }) => {
      if (!this.rpcs[rpcName]) {
        this.rpcs[rpcName] = {
          name: rpcName,
          // http客户端信息信息
          clients: {}
        };
      }
      // services 默认值
      this.rpcs[rpcName].clients[host] = {
        host,
        clientCount: 0,
      };
    });
  }

  /**
   * 获取对应的服务 本地least-connections负载均衡
   * @param {String} rpcName rpc名称 例如：admin
   * @returns {*}
   */
  async getClient(rpcName) {
    let rpc = null;
    // 查找最小连接数的节点
    Object.keys(this.rpcs[rpcName].clients)
      .forEach((host) => {
        if (!rpc) {
          rpc = this.rpcs[rpcName].clients[host];
        } else if (this.rpcs[rpcName].clients[host].clientCount
          < rpc.clientCount) {
          rpc = this.rpcs[rpcName].clients[host];
        }
      });
    if (!rpc) {
      throw BaseResponse.create(-2, '当前服务不可用');
    }
    Logger.info(`选择服务：[${rpc.host}]`);
    this.rpcs[rpcName].clients[rpc.host].clientCount += 1;
    return rpc;
  }

  /**
   * 释放连接
   * @param rpcName
   * @param host
   */
  release({ rpcName, host }) {
    this.rpcs[rpcName].clients[host].clientCount -= 1;
  }
}

module.exports = RpcClientPool;
