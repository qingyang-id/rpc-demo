/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:15
 */
/**
 * Implements the SayHello RPC method.
 */
const say = function (call, callback) {
  callback(null, { content: `Hello ${(call.request && call.request.params && call.request.params.name) || 'xxx'}` });
}

module.exports = { say };
