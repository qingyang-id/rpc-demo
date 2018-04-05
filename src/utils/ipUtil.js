/**
 * @description IP工具类
 * @author yq
 * @date 2017/8/10 上午11:20
 */
const os = require('os');

class IpUtil {
  /**
   * 获取客户端IP
   * @param  {Object} req 请求体
   * @return {String}     ip地址
   */
  static getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket && req.connection.socket.remoteAddress) || '';
  }

  /**
   * 获取本机局域网IP
   * @return {String} IP地址
   */
  static getLocalIp() {
    const interfaces = os.networkInterfaces();
    const keys = Object.keys(interfaces);
    for (let i = 0, keyLen = keys.length; i < keyLen; i += 1) {
      for (let j = 0, ifaceLen = interfaces[keys[i]].length; j < ifaceLen; j += 1) {
        const alias = interfaces[keys[i]][j];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          console.log(alias.address);
          return alias.address;
        }
      }
    }
    return '';
  }
}

module.exports = IpUtil;
