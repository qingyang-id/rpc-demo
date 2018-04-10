/**
 * @description http远程调用
 * @author yq
 * @date 2018/4/10 上午9:28
 */
const Router = require('koa-router');
const HttpCtrl = require('../../controllers/httpController');

const router = new Router({
  prefix: '/http'
});

router.get('/say', HttpCtrl.say);

router.get('/count', HttpCtrl.count);

module.exports = router.routes();
