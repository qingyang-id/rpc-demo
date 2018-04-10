/**
 * @description http请求控制层
 * @author yq
 * @date 2018/4/10 上午9:46
 */
const HttpUtil = require('../utils/httpUtil');
const BaseResponse = require('../libs/baseResponse');
const { apiHost } = require('../config').appConfig;

class HttpController {
  static async count(ctx) {
    // http请求count接口
    return HttpUtil.send({
      url: `${apiHost}/v1/test/count`,
      method: 'GET',
      json: true,
    })
      .then(({ body }) => {
        if (!body) throw BaseResponse.create(500, '请求count接口失败');
        ctx.body = body;
      });
  }

  static async say(ctx) {
    // http请求say接口
    return HttpUtil.send({
      url: `${apiHost}/v1/test/say?name=${ctx.query.name || ''}`,
      method: 'GET',
      json: true,
    })
      .then(({ body }) => {
        if (!body) throw BaseResponse.create(500, '请求say接口失败');
        ctx.body = body;
      });
  }
}

module.exports = HttpController;
