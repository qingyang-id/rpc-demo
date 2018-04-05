/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:15
 */
/**
 * Implements the SayHello RPC method.
 */
const sayHello = function (call, callback) {
  callback(null, { content: `Hello ${call.request.name}` });
}

module.exports = { sayHello };
