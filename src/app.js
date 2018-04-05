/**
 * @description 程序启动入口
 * @author yq
 * @date 2018/4/4 下午2:16
 */
const App = require('./server/app');

new App().start()
  .catch((err) => {
    console.log('服务启动失败', err);
  });
