/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:31
 */
const GrpcServer = require('./server/grpc');

console.log('grpc服务启动');
GrpcServer.getInstance().start()
  .catch((err) => {
    console.log('grpc服务启动失败', err);
  });
