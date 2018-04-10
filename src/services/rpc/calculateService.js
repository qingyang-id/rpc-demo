/**
 * @description
 * @author yq
 * @date 2018/4/4 下午9:15
 */
/**
 * Implements the SayHello RPC method.
 */
const count = function (call, callback) {
  let sum = 0;
  for (let i = 0; i < 10000; i += 1) sum += (i * 100);
  callback(null, { sum });
};

module.exports = { count };
