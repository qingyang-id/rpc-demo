/**
 * @description thrift 连接池
 * @author yq
 * @date 2017/7/16 下午12:04
 */
const { host, port } = require('../../../config/index').thriftConfig;
const ThriftClient = require('./rpcClient');
// const BaseResponse = require('../baseResponse');
// const Promise = require('bluebird');
const Logger = require('log4js').getLogger('thriftClientPool');

/**
 * 获取thrift服务js文件路径
 * @param  {Number} serverType  服务类型：1JAVA，2JS
 * @param  {String} serviceName 服务名称
 * @return {String}             thrift服务js路径
 */
function getThriftServicePath(serverType, serviceName) {
  switch (serverType) {
    case 2:
      return `./js/gen-nodejs/${serviceName.substring(serviceName.lastIndexOf('.') + 1)}`;
    default:
      // JAVA服务
      return `./java/gen-nodejs/${serviceName.substring(serviceName.lastIndexOf('.') + 1)}`;
  }
}

class ThriftClientPool {
  constructor() {
    /**
     * thriftClient 客户端map集， key为为服务名，如user;
     */
    this.rpcs = {};
    this.init();
  }

  // 静态方法实现懒汉单例模式
  static getInstance() {
    if (!ThriftClientPool.instance) {
      ThriftClientPool.instance = new ThriftClientPool();
    }
    return ThriftClientPool.instance;
  }

  /**
   * 初始化thrift服务信息
   */
  init() {
    // 初始化thrift连接池信息
    const rpcName = 'rpc';
    this.rpcs[rpcName] = {
      serverType: 'multiplex',
      serviceType: 'multiplex',
      rpcName,
      // 节点提供的服务信息
      services: {},
      // thrift客户端信息
      thrifts: {}
    };
    const serviceNames = ['helloWord', 'calculate'];
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
    this.rpcs[rpcName].thrifts[`${host}:${port}`] = {
      host,
      // 连接实例
      thrift: new ThriftClient({
        type: 'multiplex', // 多服务模式
        rpcName: 'helloWord',
        host,
        port,
      })
    };
  }

  /**
   * 获取对应的服务 本地least-connections负载均衡
   * @param {String} rpcName thrift名称 例如：admin
   * @param {String} serviceName thrift service名称 例如：AdminService
   * @returns {*}
   */
  async getClient(rpcName, serviceName) {
    const serviceNameModule = this.rpcs[rpcName].services[serviceName];
    const thriftInfo = this.rpcs[rpcName].thrifts[`${host}:${port}`];
    return thriftInfo.thrift.getClient(serviceName, serviceNameModule);
  }
}

module.exports = ThriftClientPool;
