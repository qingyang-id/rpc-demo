/**
 * @description rpc过滤器
 * @author      yq
 * @date        2018-04-08 21:34:33
 */
class BaseFilter {
  constructor() {
    this.befores = []; // before filters
    this.afters = []; // after filters
  }

  /**
   * Add before filter into the filter chain.
   *
   * @param  {Function} filter 过滤器
   */
  before(filter) {
    this.befores.push(filter);
  }

  /**
   * Add after filter into the filter chain.
   *
   * @param  {Function} filter 过滤器
   */
  after(filter) {
    this.afters.push(filter);
  }

  /**
   * Do the before filter.
   * Fail over if any filter pass err parameter to the next function.
   *
   * @param opts {Object} clienet request params
   * @param cb {Function} cb(err) callback function to invoke next chain node
   */
  beforeFilter(opts, cb) {
    let index = 0;
    const that = this;
    const next = (err, resp, newOpts) => {
      if (err || index >= that.befores.length) {
        return cb(err, resp, newOpts);
      }
      index += 1;
      const handler = that.befores[index - 1];
      if (typeof handler === 'function') {
        return handler(opts, next);
      } else if (typeof handler.before === 'function') {
        return handler.before(opts, next);
      }
      console.error('invalid before filter, handler or handler.before should be function.');
      return next(new Error('invalid before filter, handler or handler.before should be function.'));
    };

    next();
  }

  /**
   * Do after filter chain.
   *
   * @param  {Object}   err     error object
   * @param  {返回信息}   resp   response object send to client
   * @param  {Function} cb      callback function to invoke next chain node
   */
  afterFilter(err, resp, cb) {
    const that = this;
    let index = 0;
    const next = (err1, resp1) => {
      if (index >= that.afters.length) {
        return cb(err1, resp1);
      }
      index += 1;
      const handler = that.afters[index - 1];
      if (typeof handler === 'function') {
        return handler(err1, resp1, next);
      } else if (typeof handler.after === 'function') {
        return handler.after(err1, resp1, next);
      }
      console.error('invalid after filter, handler or handler.after should be function.');
      return next(new Error('invalid after filter, handler or handler.after should be function.'));
    };

    next(err, resp);
  }
}

module.exports = BaseFilter;
