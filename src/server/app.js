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

    // error-handling
    this.app.on('error', (err, ctx) => {
      console.error('app error', err, ctx);
      Logger.error('app error', err, ctx);
    });

    return this.app;
  }
}

module.exports = App;
