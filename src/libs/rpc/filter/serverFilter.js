/**
 * @description rpc server中间件
 * @author      yq
 * @date        2018-04-08 17:27:29
 */
const BaseFilter = require('./baseFilter');
/**
 * Invoke callback with check
 */
const invokeCallback = (cb, ...args) => {
  if (typeof cb === 'function') {
    cb(...args);
  }
};

class ServerFilter extends BaseFilter {
  /**
   * after filter
   * @param  {Object}   err    error info
   * @param  {Object}   result response to client
   * @param  {Function} cb     callback function
   */
  doAfterFilter(err, result, cb) {
    if (this.afterFilter) {
      this.afterFilter(err, result, (err1, result1) => {
        invokeCallback(cb, err1, result1);
      });
    } else {
      invokeCallback(cb, err, result);
    }
  }

  /**
   * init filter
   *
   * @param  {Function} actionName  rpc function
   * @param  {Object}   opts        client request params
   * @param  {Function} cb          callback function
   */
  initFilter(actionName, opts, cb) {
    const that = this;
    const doAction = () => {
      actionName(opts, (err, result) => {
        // if (err) {
        //   return invokeCallback(cb, err);
        // }
        if (that.afters.length > 0) {
          return that.doAfterFilter(err, result, cb);
        }
        return invokeCallback(cb, null, result);
      });
    };
    try {
      if (this.beforeFilter) {
        this.beforeFilter(opts, doAction);
      } else {
        doAction();
      }
    } catch (err) {
      // 打印错误信息
      console.log('err', err.stack);
      // 这个错误应该是业务代码
      invokeCallback(cb, {
        code: 500,
        message: err.message || '系统错误，请稍后重试',
      });
    }
  }
}

module.exports = ServerFilter;
