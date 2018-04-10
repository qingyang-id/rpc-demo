/**
 * @description thrift 连接池
 * @author yq
 * @date 2017/7/16 下午12:04
 */
const { rpcs } = require('../../../config/index').thriftConfig;
const RpcClient = require('./rpcClient');
const BaseResponse = require('../../baseResponse');
// const Promise = require('bluebird');
const path = require('path');
const Logger = require('../../../utils/logger').getLogger('thriftClientPool');

/**
 * 获取thrift服务js文件路径
 * @param  {Number} serverType  服务类型：1JAVA，2JS
 * @param  {String} serviceName 服务名称
 * @return {String}             thrift服务js路径
 */
function getThriftServicePath(serverType, serviceName) {
  switch (serverType) {
    case 2:
      return path.join(__dirname, `./js/gen-nodejs/${serviceName.substring(serviceName.lastIndexOf('.') + 1)}`);
    default:
      // JAVA服务
      return path.join(__dirname, `./java/gen-nodejs/${serviceName.substring(serviceName.lastIndexOf('.') + 1)}`);
  }
}

class RpcClientPool {
  constructor() {
    /**
     * thriftClient 客户端map集， key为为服务名，如user;
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
   * 初始化thrift服务信息
   */
  init() {
    // 初始化thrift连接池信息
    rpcs.forEach(({ rpcName, host, port, services: serviceNames }) => {
      if (!this.rpcs[rpcName]) {
        this.rpcs[rpcName] = {
          serverType: 'multiplex', // 多服务模式
          serviceType: 2, // js
          rpcName,
          // 节点提供的服务信息
          services: {},
          // thrift客户端信息
          clients: {}
        };
      }
      // services 默认值
      serviceNames.forEach((serviceName) => {
        // 存放服务模块信息
        try {
          const serviceFilePath = getThriftServicePath(2, serviceName);
          // 删除模块缓存
          delete require.cache[serviceFilePath];
          // eslint-disable-next-line
          this.rpcs[rpcName].services[serviceName] = require(serviceFilePath);
        } catch (err) {
          Logger.error(`thrift服务(${serviceName})加载失败`, err.stack || err);
        }
      });
      this.rpcs[rpcName].clients[`${host}:${port}`] = {
        host: `${host}:${port}`,
        clientCount: 0,
        // 连接实例
        client: new RpcClient({
          type: 'multiplex', // 多服务模式
          rpcName,
          host,
          port,
        })
      };
    });
  }

  /**
   * 获取对应的服务 本地least-connections负载均衡
   * @param {String} rpcName thrift名称 例如：admin
   * @param {String} serviceName thrift service名称 例如：AdminService
   * @returns {*}
   */
  async getClient(rpcName, serviceName) {
    let rpc = null;
    // 查找最小连接数的节点
    Object.keys(this.rpcs[rpcName].clients)
      .forEach((host) => {
        // 判断是否存活
        if (!this.rpcs[rpcName].clients[host].client.isConnected()) {
          return;
        }
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
    const serviceNameModule = this.rpcs[rpcName].services[serviceName];
    return rpc.client.getClient(serviceName, serviceNameModule);
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
