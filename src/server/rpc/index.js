/**
 * @description rpc服务
 * @author      yq
 * @date        2017-11-09 15:29:39
 */
const ServerFilter = require('../../libs/rpc/filter/serverFilter');
const { beforeFilter, afterFilter } = require('../../libs/middleware/rpcFilter');
// 基础rpc服务
const calculate = require('./calculate');
const helloWord = require('./helloWord');


// 所有rpc服务
const services = {
  rpc: {
    calculate,
    helloWord
  },
};

// 设置全局过滤器
const serverFilter = new ServerFilter();
serverFilter.before(beforeFilter);
serverFilter.after(afterFilter);

// 遍历服务名称
Object.keys(services).forEach((serverName) => {
  // 遍历指定的服务列表
  Object.keys(services[serverName]).forEach((serviceName) => {
    // 遍历具体服务的方法
    Object.keys(services[serverName][serviceName]).forEach((method) => {
      // 为方法增加过滤器
      if (typeof services[serverName][serviceName][method] === 'function') {
        services[serverName][serviceName][method] = serverFilter.initFilter.bind(serverFilter, services[serverName][serviceName][method]);
      }
    });
  });
});

module.exports = services;
