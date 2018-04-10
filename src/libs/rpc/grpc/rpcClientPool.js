/**
 * @description
 * @author yq
 * @date 2018/4/5 下午5:44
 */
const grpc = require('grpc');
const path = require('path');
const { rpcs } = require('../../../config/index').grpcConfig;
const RpcClient = require('./rpcClient');
const BaseResponse = require('../../baseResponse');
const Logger = require('../../../utils/logger').getLogger('grpcClientPool');

/**
 * 获取rpc服务js文件路径
 * @param  {String} serviceName 服务名称
 * @return {String}             rpc服务proto路径
 */
function getProtoPath(serviceName) {
  return path.join(__dirname, `./proto/${serviceName.substring(serviceName.lastIndexOf('.') + 1)}.proto`);
}

class RpcClientPool {
  constructor() {
    /**
     * grpcClient 客户端map集， key为为服务名，如user;
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
    rpcs.forEach(({ rpcName, host, port, services: serviceNames }) => {
      if (!this.rpcs[rpcName]) {
        this.rpcs[rpcName] = {
          name: rpcName,
          // 节点提供的服务信息
          services: {},
          // grpc客户端信息
          clients: {}
        };
      }
      // services 默认值
      serviceNames.forEach((serviceName) => {
        // 存放服务模块信息
        try {
          const serviceFilePath = getProtoPath(serviceName);
          // 加载模块
          this.rpcs[rpcName].services[serviceName] = grpc.load(serviceFilePath);
        } catch (err) {
          Logger.error(`grpc服务(${serviceName})加载失败`, err.stack || err);
        }
      });
      this.rpcs[rpcName].clients[`${host}:${port}`] = {
        host: `${host}:${port}`,
        clientCount: 0,
        // 连接实例
        client: new RpcClient({
          host,
          port,
        })
      };
    });
  }

  /**
   * 获取对应的服务 本地least-connections负载均衡
   * @param {String} rpcName grpc名称 例如：admin
   * @param {String} serviceName grpc service名称 例如：AdminService
   * @returns {*}
   */
  async getClient(rpcName, serviceName) {
    let rpc = null;
    // 查找最小连接数的节点
    Object.keys(this.rpcs[rpcName].clients)
      .forEach((host) => {
        // 判断是否存活
        // if (!this.rpcs[rpcName].clients[host].client.isConnected()) {
        //   return;
        // }
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
