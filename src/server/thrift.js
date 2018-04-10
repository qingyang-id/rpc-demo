/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:12
 */
const ThriftServer = require('../libs/rpc/thrift/rpcServer');
const { host, port } = require('../config').thriftConfig;
const services = require('../services/rpc/index');


class RpcServer {
  static getInstance() {
    if (!RpcServer.instance) {
      RpcServer.instance = new RpcServer();
    }
    return RpcServer.instance;
  }

  getRpcServices() {
    const rpcServices = [];
    Object.keys(services).forEach((rpcName) => {
      // statements
      Object.keys(services[rpcName]).forEach((serviceName) => {
        const fileName = (serviceName.charAt(0).toUpperCase() + serviceName.slice(1));
        console.log(__dirname)
        // eslint-disable-next-line
        const service = require(`../libs/rpc/thrift/js/gen-nodejs/${fileName}`);
        rpcServices.push({
          serviceName,
          // 服务接口定义
          service,
          // 服务接口实现
          serviceImpl: services[rpcName][serviceName]
        });
      });
    });
    return rpcServices;
  }

  /**
   * 启动thrift服务
   */
  async start() {
    return new Promise((resolve, reject) => new ThriftServer({
      type: 'multiplex',
      host,
      port,
      services: this.getRpcServices(),
    })
      .createServer((err) => {
        if (err) {
          // 服务启动失败
          console.error('服务启动失败:', err);
          return reject(err);
        }
        console.log('服务启动成功');
        // 写入zookeeper
        return resolve();
      }));
  }
}

module.exports = RpcServer;
