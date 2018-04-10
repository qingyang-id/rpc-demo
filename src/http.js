/**
 * @description http服务启动脚本
 * @author yq
 * @date 2018/4/10 下午5:08
 */
const http = require('http');
const App = require('./server/app');
const { host } = require('./config').appConfig;
const { rpcs } = require('./config').httpConfig;
const Logger = require('./utils/logger').getLogger('app');

new App().start()
  .then((app) => {
    rpcs.forEach(({ port }) => {
      const server = http.createServer(app.callback());
      server.listen(port, host, () => {
        console.info(`http服务启动，访问地址：http://${host}:${port}`);
        Logger.info(`http服务启动，访问地址：http://${host}:${port}`);
      });
      server.on('error', (err, ctx) => {
        console.error('server error', err, ctx);
        Logger.error('server error', err, ctx);
      });
    });
  })
  .catch((err) => {
    console.log('服务启动失败', err);
  });
