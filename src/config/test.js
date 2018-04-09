/**
 * @description 生产环境配置文件
 * @author yq
 * @date 2018/4/9 下午10:03
 */
const logConfig = require('./log/log4j_config_test.js');

module.exports = {
  logConfig,
  appConfig: {
    clusterNum: 3,
    name: 'gateway',
    host: '0.0.0.0',
    port: 3000,
    enableCors: true, // 是否允许跨域
    enableGzip: true, // 是否压缩
    compressOpt: {
      threshold: '100kb'
    }
  },
};
