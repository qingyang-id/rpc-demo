/**
 * @description
 * @author yq
 * @date 2018/4/4 下午3:24
 */
const Router = require('koa-router');
const { rpcLogic } = require('../../libs/rpc/thrift/rpcLogic');

const router = new Router({
  prefix: '/thrift'
});

router.get('*', rpcLogic);

module.exports = router.routes();
