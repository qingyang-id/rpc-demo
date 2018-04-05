/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:31
 */
const RpcServer = require('./server/thrift');

console.log('thrift服务启动');
RpcServer.getInstance().start()
  .catch((err) => {
    console.log('thrift服务启动失败', err);
  });
