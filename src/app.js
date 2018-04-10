/**
 * @description 程序启动入口
 * @author yq
 * @date 2018/4/4 下午2:16
 */
const http = require('http');
const App = require('./server/app');
const { host, port } = require('./config').appConfig;
const Logger = require('./utils/logger').getLogger('app');

Logger.info('启动....');
console.log('启动....');
new App().start()
  .then((app) => {
    console.log('服务启动成功');
    console.log('启动服务......');
    const server = http.createServer(app.callback());
    server.listen(port, host, () => {
      console.info(`服务启动，访问地址：http://${host}:${port}`);
      Logger.info(`服务启动，访问地址：http://${host}:${port}`);
    });
    server.on('error', (err, ctx) => {
      console.error('server error', err, ctx);
      Logger.error('server error', err, ctx);
    });
  })
  .catch((err) => {
    console.log('服务启动失败', err);
  });
