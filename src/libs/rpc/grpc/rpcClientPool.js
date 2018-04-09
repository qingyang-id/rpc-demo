/**
 * @description
 * @author yq
 * @date 2018/4/5 下午5:44
 */
const grpc = require('grpc');
const path = require('path');
const { host, port } = require('../../../config/index').grpcConfig;
const RpcClient = require('./rpcClient');
const Logger = require('log4js').getLogger('grpcClientPool');

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
    const rpcName = 'rpc';
    this.rpcs[rpcName] = {
      name: rpcName,
      // 节点提供的服务信息
      services: {},
      // grpc客户端信息
      clients: {}
    };
    const serviceNames = ['helloWorldService', 'calculateService'];
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
      host,
      // 连接实例
      client: new RpcClient({
        host,
        port,
      })
    };
  }

  /**
   * 获取对应的服务 本地least-connections负载均衡
   * @param {String} rpcName grpc名称 例如：admin
   * @param {String} serviceName grpc service名称 例如：AdminService
   * @returns {*}
   */
  async getClient(rpcName, serviceName) {
    const serviceNameModule = this.rpcs[rpcName].services[serviceName];
    const rpc = this.rpcs[rpcName].clients[`${host}:${port}`];
    return rpc.client.getClient(serviceName, serviceNameModule);
  }
}

module.exports = RpcClientPool;
