/**
 * @description 计算服务
 * @author yq
 * @date 2018/4/10 上午9:30
 */
const CalculateService = require('../server/rpc/calculateService');
const BaseResponse = require('../libs/baseResponse');

class CalculateController {
  static count(ctx) {
    CalculateService.count(ctx, (err, result) => {
      if (err) throw err;
      ctx.body = BaseResponse.SUCCESS.clone().setData(result);
    });
  }
}

module.exports = CalculateController;
