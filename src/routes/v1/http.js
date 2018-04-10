/**
 * @description http远程调用
 * @author yq
 * @date 2018/4/10 上午9:28
 */
const Router = require('koa-router');
const { rpcLogic } = require('../../libs/rpc/http/rpcLogic');

const router = new Router({
  prefix: '/http'
});

router.get('*', rpcLogic);

module.exports = router.routes();
