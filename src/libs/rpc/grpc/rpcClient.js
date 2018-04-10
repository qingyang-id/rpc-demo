/**
 * @description grpc客户端
 * @author yq
 * @date 2018/4/4 下午1:18
 */
const grpc = require('grpc');


class RpcClient {
  constructor({ host, port }) {
    this.host = host;
    this.port = port;
    this.clients = {};
  }

  /**
   * 获取对应客户端实例
   *
   * @param serviceName rpc服务名称
   * @param serviceNameModule rpc服务模块
   * @param reload 是否重新加载客户端
   *
   * @returns {*}
   */
  getClient(serviceName, serviceNameModule, reload = false) {
    if (!this.clients[serviceName] || reload) {
      if (!serviceNameModule) {
        console.error(`客户端[${serviceName}]对应thrift文件不存在`);
        throw new Error('没有对应的grpc服务');
      }
      // const proto = grpc.load(path.join(__dirname, `/proto/${serviceName}.proto`));
      const protoName = (serviceName.charAt(0).toUpperCase() + serviceName.slice(1));
      this.clients[serviceName] = new serviceNameModule[serviceName][protoName](`${this.host}:${this.port}`, grpc.credentials.createInsecure());
      // todo 用来记录客户端信息，有没有更好的方案
      Object.assign(this.clients[serviceName], {
        host: `${this.host}:${this.port}`,
      });
    }
    return this.clients[serviceName];
  }
}

module.exports = RpcClient;
