/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:12
 */
const ThriftServer = require('../libs/rpc/thrift/rpcServer');
const { rpcs } = require('../config').thriftConfig;
const services = require('../services/rpc/index');


class RpcServer {
  static getInstance() {
    if (!RpcServer.instance) {
      RpcServer.instance = new RpcServer();
    }
    return RpcServer.instance;
  }

  /**
   * 启动thrift服务
   */
  async start() {
    rpcs.forEach(({ rpcName, host, port, services: serviceNames }) => {
      const rpcServices = [];
      serviceNames.forEach((serviceName) => {
        try {
          const fileName = (serviceName.charAt(0).toUpperCase() + serviceName.slice(1));
          console.log(__dirname)
          // eslint-disable-next-line
          const service = require(`../libs/rpc/thrift/js/gen-nodejs/${fileName}`);
          rpcServices.push({
            serviceName,
            // 服务接口
            service,
            // 服务接口实现
            serviceImpl: services[rpcName][serviceName],
          });
        } catch (err) {
          console.error('加载grpc文件失败');
        }
      });
      new ThriftServer({
        type: 'multiplex',
        host,
        port,
        services: rpcServices,
      })
        .createServer((err) => {
          if (err) {
            // 服务启动失败
            console.error('thrift服务启动失败:', err);
          }
          console.log(`thrift服务启动成功 ${host}:${port}`);
          // 写入zookeeper
        });
    });
    return null;
  }
}

module.exports = RpcServer;
