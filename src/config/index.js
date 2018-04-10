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
// Object.assign(config.appConfig, { apiHost: `http://${host}:${config.appConfig.port}` });
const port = 3000;
Object.assign(config, {
  httpConfig: {
    // rpc服务进行服务发现与治理
    rpcs: [{
      rpcName: 'rpc',
      host: `http://${host}:${port}`,
    }],
    // 配置到数据表中
    apiConfig: {
      'get_/v1/http/say': {
        rpcName: 'rpc',
        method: 'GET',
        path: '/v1/test/say',
      },
      'get_/v1/http/count': {
        rpcName: 'rpc',
        method: 'GET',
        path: '/v1/test/count',
      }
    }
  },
  thriftConfig: {
    // rpc服务进行服务发现与治理
    rpcs: [{
      rpcName: 'rpc',
      host,
      port: 12000,
      services: ['helloWorldService', 'calculateService'],
    }, {
      rpcName: 'rpc',
      host,
      port: 12001,
      services: ['helloWorldService', 'calculateService'],
    }],
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
    // rpc服务进行服务发现与治理
    rpcs: [{
      rpcName: 'rpc',
      host,
      port: 11000,
      services: ['helloWorldService', 'calculateService'],
    }, {
      rpcName: 'rpc',
      host,
      port: 11001,
      services: ['helloWorldService', 'calculateService'],
    }],
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
