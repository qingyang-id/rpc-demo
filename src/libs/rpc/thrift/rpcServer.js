/**
 * @description thrift 客户端
 * @author yq
 * @date 2017/7/15 下午4:29
 */
// 引入thrift模块
const thrift = require('thrift');
// 事件监听
const { EventEmitter } = require('events');
// 工具类
// 日志管理工具
const Logger = require('../../../utils/logger').getLogger('thriftServer');
const Promise = require('bluebird');

// 服务状态
const SERVER_STATUS = {
  // 被销毁
  destroyed: -10,
  // 未建立
  uncreated: 0,
  // 创建中
  creating: 1,
  // 已建立
  created: 10
};

class RpcServer extends EventEmitter {
  // 构造函数
  /**
   * 构造函数
   * @param {Array} services thrift列表
   * @param {String} host 主机地址
   * @param {Number} port 端口
   * @param {String} type thrift类型：tcp, multiplex，http, websocket
   */
  constructor({ services, host, port, type = 'tcp' }) {
    super();
    // thrift服务
    this.thrfitServer = null;
    // thrift server 信息
    this.services = services;
    // thrift服务状态
    this.status = SERVER_STATUS.uncreated;
    // thrift服务器端口号
    this.host = host;
    // thrift服务端口
    this.port = port;
    // 类型 tcp, multiplex，http, websocket
    this.type = type;
    console.log('服务模式type：', this.type);
  }

  /**
   * 节点是否已创建
   * @returns {boolean}
   */
  iscreated() {
    return this.status === SERVER_STATUS.created;
  }

  /**
   * 重建服务
   */
  serverListener() {
    const that = this;
    this.removeAllListeners();
    const thriftServerName = `Rpc : [${that.host}:${that.port}]`;
    this.once('serverCreated', () => {
      console.info(`${thriftServerName}  server has created.`);
      Logger.info(`${thriftServerName}  server has created.`);
    });
    // 监听重建服务事件
    this.once('retryCreate', () => {
      console.info(`${thriftServerName} 服务断掉，尝试重新建立服务`);
      Logger.info(`${thriftServerName} 服务断掉，尝试重新建立服务`);
      // 忽略被销毁的节点
      if (that.status === SERVER_STATUS.destroyed) {
        console.info(`${thriftServerName}已被销毁， 忽略此次重建`);
        Logger.info(`${thriftServerName}已被销毁， 忽略此次重建`);
        return;
      }
      // 忽略正在服务的节点
      if (that.status === SERVER_STATUS.creating) {
        console.info(`${thriftServerName}服务创建中...，忽略此次重建`);
        Logger.info(`${thriftServerName}服务创建中...，忽略此次重建`);
        return;
      }
      that.status = SERVER_STATUS.creating;
      Promise.delay(1000)
        .then(() => {
          that.createServer();
        });
    });
  }

  /**
   * 服务监听器
   */
  thriftMonitor() {
    const that = this;
    this.thrfitServer.once('close', (err) => {
      that.thrfitServer = null;
      const error = err || { message: '无', stack: '无' };
      console.error(`thrfitServer close Event 服务关闭，message:${error.message}`, error.stack || error);
      Logger.error(`thrfitServer close Event 服务关闭，message:${error.message}`, error.stack || error);
      // that.emit('retryCreate');
    });
    this.thrfitServer.once('error', (err) => {
      that.thrfitServer = null;
      const error = err || { message: '无', stack: '无' };
      console.error(`thrfitServer error Event 服务错误，message:${error.message}`, error.stack || error);
      Logger.error(`thrfitServer error Event 服务错误，message:${error.message}`, error.stack || error);
      // that.emit('retryCreate');
    });
  }

  /**
   * 创建thrift server
   */
  createServer(cb) {
    const that = this;
    if (that.status === SERVER_STATUS.destroyed) {
      console.info('thrift 服务已销毁，忽略此次执行');
      Logger.info('thrift 服务已销毁，忽略此次执行');
      if (typeof cb === 'function') cb();
      return;
    }
    if (that.status === SERVER_STATUS.created) {
      console.info('thrift 服务已建立，忽略此次执行');
      Logger.info('thrift 服务已建立，忽略此次执行');
      if (typeof cb === 'function') cb();
      return;
    }
    // 启动事件监听
    // this.serverListener();
    switch (this.type) {
      case 'multiplex':
        // 启动多服务
        this.createMultiplexServer();
        break;
      default:
        this.createMultiplexServer();
        break;
    }
    // 服务
    this.thrfitServer.on('error', (err) => {
      that.thrfitServer = false;
      that.status = SERVER_STATUS.uncreated;
      const error = err || { message: '无', stack: '无' };
      console.error(`thrfitServer error 服务错误，message:${error.message}`, error.stack || error);
      Logger.error(`thrfitServer error 服务错误，message:${error.message}`, error.stack || error);
      // that.emit('retryCreate');
    });
    this.thrfitServer.on('listening', (error) => {
      that.status = SERVER_STATUS.created;
      console.info('thrift listening 建立服务成功 error:', error || '无');
      Logger.info('thrift listening 建立服务成功 error:', error || '无');
      // that.thriftMonitor();
      // that.emit('serverCreated');
      if (typeof cb === 'function') cb();
    });
  }

  /**
   * 新建多服务模式thrift服务
   * @param services service列表
   *        {
   *          fileName: // 文件名称
   *          service: // service实现
   *        }
   * @returns {*}
   */
  createMultiplexServer() {
    // 多服务注册
    const processor = new thrift.MultiplexedProcessor();
    this.services.forEach((service) => {
      // 实现方法
      const thriftService = new service.service.Processor(service.serviceImpl);
      processor.registerProcessor(`${service.serviceName}`, thriftService);
    });
    // var framedTransport = new thrift.TFramedTransport();
    // TFramedTransport 一定要这个避免报错
    // const transport = thrift.TFramedTransport;
    // const protocol = thrift.TBinaryProtocol;
    const options = {
      transport: thrift.TFramedTransport,
      protocol: thrift.TCompactProtocol
    };
    this.thrfitServer = thrift.createMultiplexServer(processor, options);
    this.thrfitServer.listen(this.port);
  }

  /**
   * 销毁实例
   */
  destroy() {
    try {
      console.warn(`销毁Rpc节点: [${this.host}:${this.port}]`);
      Logger.debug(`销毁Rpc节点: [${this.host}:${this.port}]`);
      // 置状态为删除
      this.status = SERVER_STATUS.destroyed;
      // 清除所有监听器
      this.removeAllListeners();
      if (this.thrfitServer) {
        console.log(this.thrfitServer);
        this.thrfitServer.end();
      }
    } catch (err) {
      console.error(`销毁Rpc节点: [${this.host}:${this.port}] error`, err.stack || err);
      Logger.error(`销毁Rpc节点: [${this.host}:${this.port}] error`, err.stack || err);
    }
  }
}

module.exports = RpcServer;
