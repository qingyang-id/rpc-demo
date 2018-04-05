/**
 * @description 动态加载路由信息
 * @author yq
 * @date 2018/4/4 下午2:59
 */
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const Router = require('koa-router');

class RouterUtil {
  constructor(app, dir) {
    this.app = app;
    this.dir = dir;
    this.routersMap = {};
  }

  async initRouters() {
    const versions = fs.readdirSync(this.dir)
      .filter(version => !version.startsWith('.') && fs.statSync(path.join(this.dir, version)).isDirectory());
    await Promise.map(versions, (version) => {
      this.routersMap[version] = new Router({
        prefix: `/${version}`
      });
      return this.setRoutes(path.join(this.dir, version), version);
    });
    console.log(this.routersMap);
    versions.forEach(version => this.app.use(this.routersMap[version].routes()));
    return null;
  }

  async setRoutes(dir, version) {
    const stat = fs.statSync(dir);
    if (stat.isDirectory()) {
      let files = fs.readdirSync(dir);
      files = files.filter(file => !file.startsWith('.'));
      return Promise.map(files, file => this.setRoutes(path.join(dir, file), version));
    }
    // eslint-disable-next-line
    const routes = require(dir);
    this.routersMap[version].use(routes);
    return null;
  }
}
// new RouterUtil(path.join(__dirname, '../')).init()
//   .then(() => console.log('成功'))
//   .catch(err => console.error('失败：', err));
module.exports = RouterUtil;
