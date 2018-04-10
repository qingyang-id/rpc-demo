/**
 * @description
 * @author yq
 * @date 2018/4/10 上午9:44
 */
const Router = require('koa-router');
const HelloWorldCtrl = require('../../../controllers/helloWorldController');

const router = new Router({
  prefix: '/test'
});

router.get('/say', HelloWorldCtrl.say);

module.exports = router.routes();
