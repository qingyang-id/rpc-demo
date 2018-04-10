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
const Logger = require('../../../utils/logger').getLogger('thrift');
const Promise = require('bluebird');
// const BaseResponse = require('../baseResponse');

// 连接状态
const CONNECT_STATUS = {
  // 被销毁
  destroyed: -10,
  // 未连接
  unconnected: 0,
  // 连接中
  connecting: 1,
  // 已连接
  connected: 10
};

class RpcClient extends EventEmitter {
  // 构造函数
  /**
   * 构造函数
   * @param {String} host 主机地址
   * @param {Number} port 端口
   * @param {String} type thrift类型：tcp, multiplex，http, websocket
   * @param {Boolean} ssl use ssl
   * @param {String} path 接口路径
   */
  constructor({ host, port, type = 'tcp', ssl = false, path = '/' }) {
    super();
    // thrift连接
    this.thriftConnect = null;
    // thrift client 实例
    this.clients = {};
    // thrift连接状态
    this.status = CONNECT_STATUS.unconnected;
    // thrift服务器端口号
    this.host = host;
    // thrift服务端口
    this.port = port;
    // 类型 tcp, multiplex，http, websocket
    this.type = type;
    // use ssl
    this.ssl = ssl;
    // 接口路径
    this.path = path;
    // 重连次数
    this.reconnectCount = 0;
    this.createConnect();
  }

  /**
   * 节点是否已连接
   * @returns {boolean}
   */
  isConnected() {
    return this.status === CONNECT_STATUS.connected;
  }

  /**
   * 重建连接
   */
  connectListener() {
    const that = this;
    this.removeAllListeners();
    const thriftServerName = `Thrift : [${that.host}:${that.port}]`;
    this.once('connectCreated', () => {
      console.info(`${thriftServerName}  connect has created.`);
      Logger.info(`${thriftServerName}  connect has created.`);
      this.reconnectCount = 0; // 重置重连次数
    });
    // 监听重建连接事件
    this.once('retryConnect', () => {
      if (this.reconnectCount >= 15) {
        console.info(`${thriftServerName}连接失败，且超过最大重试次数`);
        Logger.info(`${thriftServerName}连接失败，且超过最大重试次数`);
        return;
      }
      console.info(`${thriftServerName} 连接断掉，尝试重新建立连接`);
      Logger.info(`${thriftServerName} 连接断掉，尝试重新建立连接`);
      // 忽略被销毁的节点
      if (that.status === CONNECT_STATUS.destroyed) {
        console.info(`${thriftServerName}已被销毁， 忽略此次重连`);
        Logger.info(`${thriftServerName}已被销毁， 忽略此次重连`);
        return;
      }
      // 忽略正在连接的节点
      if (that.status === CONNECT_STATUS.connecting) {
        console.info(`${thriftServerName}连接中...，忽略此次重连`);
        Logger.info(`${thriftServerName}连接中...，忽略此次重连`);
        return;
      }
      that.status = CONNECT_STATUS.connecting;
      Promise.delay(1000 * this.reconnectCount)
        .then(() => {
          this.reconnectCount += 1; // 重连次数加1
          that.createConnect();
        });
    });
  }

  /**
   * 连接监听器
   */
  connectMonitor() {
    const that = this;
    this.thriftConnect.once('close', (err) => {
      that.thriftConnect = false;
      const error = err || { message: '无', stack: '无' };
      console.error(`thriftConnect close Event 连接关闭，message:${error.message}`, error.stack || error);
      Logger.error(`thriftConnect close Event 连接关闭，message:${error.message}`, error.stack || error);
      that.emit('retryConnect');
    });
    this.thriftConnect.once('error', (err) => {
      that.thriftConnect = false;
      const error = err || { message: '无', stack: '无' };
      console.error(`thriftConnect error Event 连接错误，message:${error.message}`, error.stack || error);
      Logger.error(`thriftConnect error Event 连接错误，message:${error.message}`, error.stack || error);
      that.emit('retryConnect');
    });
  }

  /**
   * 创建connect
   */
  createConnect() {
    if (this.status === CONNECT_STATUS.destroyed) {
      console.info('thrift 连接已销毁，忽略此次执行');
      Logger.info('thrift 连接已销毁，忽略此次执行');
      return;
    }
    if (this.status === CONNECT_STATUS.connected) {
      console.info('thrift 连接已建立，忽略此次执行');
      Logger.info('thrift 连接已建立，忽略此次执行');
      return;
    }
    // 启动事件监听
    this.connectListener();
    // 创建连接和客户端
    let options = {
      transport: thrift.TBufferedTransport,
      protocol: thrift.TBinaryProtocol
    };
    if (this.type === 'multiplex') {
      options = {
        transport: thrift.TFramedTransport,
        protocol: thrift.TCompactProtocol // 服务端定义的这种格式，与服务端保持一致
      };
    } else if (this.type === 'http') {
      options.path = this.path;
      options.headers = {
        Connection: 'close'
      };
    } else if (this.type === 'websocket') {
      options.path = this.path;
    }
    if (this.ssl) {
      if (this.type === 'tcp' || this.type === 'multiplex') {
        options.rejectUnauthorized = false;
      } else if (this.type === 'http') {
        options.nodeOptions = { rejectUnauthorized: false };
        options.https = true;
      } else if (this.type === 'websocket') {
        options.wsOptions = { rejectUnauthorized: false };
        options.secure = true;
      }
    }
    if (this.type === 'tcp' || this.type === 'multiplex') {
      this.thriftConnect = this.ssl ?
        thrift.createSSLConnection(this.host, this.port, options) :
        thrift.createConnection(this.host, this.port, options);
    } else if (this.type === 'http') {
      this.thriftConnect = thrift.createHttpConnection(this.host, this.port, options);
    } else if (this.type === 'websocket') {
      this.thriftConnect = thrift.createWSConnection(this.host, this.port, options);
      this.thriftConnect.open();
    }
    // 重置客户端实例
    this.clients = {};
    // 连接
    this.thriftConnect.on('error', (err) => {
      this.thriftConnect = false;
      this.status = CONNECT_STATUS.unconnected;
      const error = err || { message: '无', stack: '无' };
      console.error(`thriftConnect error 连接错误，message:${error.message}`, error.stack || error);
      Logger.error(`thriftConnect error 连接错误，message:${error.message}`, error.stack || error);
      this.emit('retryConnect');
    });
    this.thriftConnect.on('connect', (error) => {
      this.status = CONNECT_STATUS.connected;
      console.info('thrift 建立连接成功 error:', error || '无');
      Logger.info('thrift 建立连接成功 error:', error || '无');
      this.connectMonitor();
      this.emit('connectCreated');
    });
  }

  /**
   * 获取对应客户端实例
   *
   * @param serviceName thrift服务名称
   * @param serviceNameModule thrift服务模块
   * @param reload 是否重新加载客户端
   *
   * @returns {*}
   */
  async getClient(serviceName, serviceNameModule, reload = false) {
    if (!this.thriftConnect) {
      this.createConnect();
    }
    if (!this.clients[serviceName] || reload) {
      console.info(`不存在客户端[${serviceName}]，新建此实例`);
      Logger.info(`不存在客户端[${serviceName}]，新建此实例`);
      if (!serviceNameModule) {
        console.error(`客户端[${serviceName}]对应thrift文件不存在`);
        Logger.error(`客户端[${serviceName}]对应thrift文件不存在`);
        throw new Error('没有对应的thrift服务');
      }
      switch (this.type) {
        case 'tcp':
          this.clients[serviceName] = thrift.createClient(serviceNameModule, this.thriftConnect);
          break;
        case 'multiplex':
          this.clients[serviceName] = new thrift.Multiplexer().createClient(serviceName,
            serviceNameModule, this.thriftConnect);
          break;
        case 'http':
          this.clients[serviceName] = thrift.createHttpClient(serviceNameModule, this.thriftConnect);
          break;
        case 'websocket':
          this.clients[serviceName] = thrift.createWSClient(serviceNameModule, this.thriftConnect);
          break;
        default:
      }
      // todo 用来记录客户端信息，有没有更好的方案
      Object.assign(this.clients[serviceName], {
        host: `${this.host}:${this.port}`,
      });
    }
    return this.clients[serviceName];
  }

  /**
   * 删除客户端服务实例
   *
   * @param  {String} serviceName 服务名称
   */
  removeClient(serviceName) {
    if (this.clients[serviceName]) {
      delete this.clients[serviceName];
    }
  }

  /**
   * 销毁实例
   */
  destroy() {
    try {
      console.debug(`销毁Thrift节点: [${this.host}:${this.port}]`);
      Logger.debug(`销毁Thrift节点: [${this.host}:${this.port}]`);
      // 置状态为删除
      this.status = CONNECT_STATUS.destroyed;
      // 清除所有监听器
      this.removeAllListeners();
      if (this.thriftConnect) {
        this.thriftConnect.end();
      }
    } catch (err) {
      console.error(`销毁Thrift节点: [${this.host}:${this.port}] error`, err.stack || err);
      Logger.error(`销毁Thrift节点: [${this.host}:${this.port}] error`, err.stack || err);
    }
  }
}

module.exports = RpcClient;
