/**
 * @description 程序启动脚本
 * @author yq
 * @date 2018/4/4 下午8:49
 */
const Koa = require('koa');
const koaCors = require('koa2-cors');
const path = require('path');
const errorHandle = require('../libs/middleware/errorHandler');
const requestHandler = require('../libs/middleware/requestHandler');
const RouterUtil = require('../routes/routerUtil');
const Logger = require('../utils/logger').getLogger('app');
const { host, port } = require('../config').appConfig;


class App {
  constructor() {
    this.app = new Koa();
  }

  async start() {
    // 开启nginx获取真实ip
    this.app.proxy = true;
    // 允许跨域
    this.app.use(koaCors({ origin: '*' }));

    // logger
    this.app.use(requestHandler);

    // error handler
    this.app.use(errorHandle);

    // 路由
    await new RouterUtil(this.app, path.join(__dirname, '../routes')).initRouters();

    this.app.listen(port, host, () => {
      console.info(`服务启动，访问地址：http://${host}:${port}`);
      Logger.info(`服务启动，访问地址：http://${host}:${port}`);
    });

    // this.app.on('error', (err, ctx) => {
    //   console.error('server error', err, ctx);
    //   Logger.error('server error', err, ctx);
    // });
  }
}

module.exports = App;
