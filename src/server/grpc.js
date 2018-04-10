/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:06
 */
const grpc = require('grpc');
const path = require('path');
const services = require('../services/rpc/index');
const { host, port } = require('../config').grpcConfig;

class GrpcServer {
  static getInstance() {
    if (!GrpcServer.instance) {
      GrpcServer.instance = new GrpcServer();
    }
    return GrpcServer.instance;
  }

  getRpcServicesMap() {
    const rpcServicesMap = {};
    Object.keys(services).forEach((serverName) => {
      rpcServicesMap[serverName] = [];
      // statements
      Object.keys(services[serverName]).forEach((serviceName) => {
        const proto = grpc.load(path.join(__dirname, `../libs/rpc/grpc/proto/${serviceName}.proto`));
        const protoName = (serviceName.charAt(0).toUpperCase() + serviceName.slice(1));
        rpcServicesMap[serverName].push({
          serviceName,
          // 服务接口
          service: proto[serviceName][protoName].service,
          // 服务接口实现
          serviceImpl: services[serverName][serviceName],
        });
      });
    });
    return rpcServicesMap;
  }

  getServers() {
    const servers = [];
    const servicesMap = this.getRpcServicesMap();
    Object.keys(servicesMap).forEach((serverName) => {
      const server = new grpc.Server();
      servicesMap[serverName].forEach(({ service, serviceImpl }) => server.addService(service, serviceImpl));
      servers.push(server);
    });
    return servers;
  }

  async start() {
    const rpcServers = this.getServers();
    rpcServers[0].bind(`${host}:${port}`, grpc.ServerCredentials.createInsecure());
    rpcServers[0].start();
    console.log(`grpc服务启动成功 ${host}:${port}`);
  }
}

module.exports = GrpcServer;
