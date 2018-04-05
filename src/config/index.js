/**
 * @description
 * @author yq
 * @date 2018/4/4 下午2:24
 */
const IpUtil = require('../utils/ipUtil');

const host = IpUtil.getLocalIp();

module.exports = {
  appConfig: {
    name: 'gateway',
    host: '0.0.0.0',
    port: 8088,
    enableCors: true, // 是否允许跨域
    enableGzip: true, // 是否压缩
    compressOpt: {
      threshold: '100kb'
    }
  },
  thriftConfig: {
    host,
    port: 10000,
    apiConfig: {
      'get_/v1/thrift/say': {
        rpcName: 'rpc',
        serviceName: 'helloWord',
        actionName: 'sayHello',
      },
      'get_/v1/thrift/count': {
        rpcName: 'rpc',
        serviceName: 'calculate',
        actionName: 'count',
      }
    }
  },
  grpcConfig: {
    host,
    port: 20000,
    apiConfig: {
      'get_/v1/grpc/say': {
        rpcName: 'rpc',
        serviceName: 'helloWord',
        actionName: 'sayHello',
      },
      'get_/v1/grpc/count': {
        rpcName: 'rpc',
        serviceName: 'calculate',
        actionName: 'count',
      }
    }
  }
};
