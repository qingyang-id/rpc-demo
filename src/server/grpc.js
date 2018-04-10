/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:06
 */
const grpc = require('grpc');
const path = require('path');
const services = require('../services/rpc/index');
const { rpcs } = require('../config').grpcConfig;

class GrpcServer {
  static getInstance() {
    if (!GrpcServer.instance) {
      GrpcServer.instance = new GrpcServer();
    }
    return GrpcServer.instance;
  }

  async start() {
    rpcs.forEach(({ rpcName, host, port, services: serviceNames }) => {
      const rpcServices = [];
      serviceNames.forEach((serviceName) => {
        try {
          const proto = grpc.load(path.join(__dirname, `../libs/rpc/grpc/proto/${serviceName}.proto`));
          const protoName = (serviceName.charAt(0).toUpperCase() + serviceName.slice(1));
          rpcServices.push({
            serviceName,
            // 服务接口
            service: proto[serviceName][protoName].service,
            // 服务接口实现
            serviceImpl: services[rpcName][serviceName],
          });
        } catch (err) {
          console.error('加载grpc文件失败');
        }
      });
      const server = new grpc.Server();
      rpcServices.forEach(({ service, serviceImpl }) => server.addService(service, serviceImpl));
      // 启动服务
      server.bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());
      server.start();
      console.log(`grpc服务启动成功 ${host}:${port}`);
      return null;
    });
  }
}

module.exports = GrpcServer;
