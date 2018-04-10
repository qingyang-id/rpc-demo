/**
 * @description 计算服务
 * @author yq
 * @date 2018/4/10 上午9:30
 */
const HelloWorldService = require('../server/rpc/helloWorldService');
const BaseResponse = require('../libs/baseResponse');

class HelloWorldController {
  static async say(ctx) {
    const params = { params: ctx.query };
    HelloWorldService.say({ request: params }, (err, result) => {
      if (err) throw err;
      ctx.body = BaseResponse.SUCCESS.clone().setData(result);
    });
  }
}

module.exports = HelloWorldController;
