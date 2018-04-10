/**
 * @description
 * @author yq
 * @date 2018/4/10 上午9:45
 */
const Router = require('koa-router');
const CalculateCtrl = require('../../../controllers/calculateController');

const router = new Router({
  prefix: '/test'
});

router.get('/count', CalculateCtrl.count);

module.exports = router.routes();
