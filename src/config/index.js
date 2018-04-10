/**
 * @description
 * @author yq
 * @date 2018/4/4 下午2:24
 */
const IpUtil = require('../utils/ipUtil');

let config;

switch (process.env.NODE_ENV) {
  case 'production':
    config = require('./prod');
    break;
  case 'test':
    config = require('./test');
    break;
  default:
    config = require('./dev');
}

const host = IpUtil.getLocalIp();
Object.assign(config.appConfig, { apiHost: `http://${host}:${config.appConfig.port}` });
Object.assign(config, {
  thriftConfig: {
    host,
    port: 10000,
    // 配置到数据表中
    apiConfig: {
      'get_/v1/thrift/say': {
        rpcName: 'rpc',
        serviceName: 'helloWorldService',
        actionName: 'say',
      },
      'get_/v1/thrift/count': {
        rpcName: 'rpc',
        serviceName: 'calculateService',
        actionName: 'count',
      }
    }
  },
  // 配置到数据表中
  grpcConfig: {
    host,
    port: 11000,
    apiConfig: {
      'get_/v1/grpc/say': {
        rpcName: 'rpc',
        serviceName: 'helloWorldService',
        actionName: 'say',
      },
      'get_/v1/grpc/count': {
        rpcName: 'rpc',
        serviceName: 'calculateService',
        actionName: 'count',
      }
    }
  }
});

module.exports = config;
