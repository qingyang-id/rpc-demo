/**
 * @description grpc 路由
 * @author yq
 * @date 2018/4/4 下午2:59
 */
const Router = require('koa-router');
const { rpcLogic } = require('../../libs/rpc/grpc/rpcLogic');

const router = new Router({
  prefix: '/grpc'
});

router.get('*', rpcLogic);

module.exports = router.routes();
