/**
 * @description 常用原型方法
 * @author      yq
 * @date        2017-11-17 17:35:33
 */

// 连字符转驼峰
// eslint-disable-next-line
String.prototype.hyphenToHump = function (hyphen = '-') {
  const regexp = new RegExp(`${hyphen}(\\w)`, 'g');
  return this.replace(regexp, (...args) => args[1].toUpperCase());
};

// 驼峰转连字符
// eslint-disable-next-line
String.prototype.humpToHyphen = function (hyphen = '-') {
  return this.replace(/([A-Z])/g, `${hyphen}$1`).toLowerCase();
};

/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * 例子：
 * dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S') ==> 2006-07-02 08:09:04.423
 * dateFormat(new Date(), 'yyyy-M-d h:m:s.S')      ==> 2006-7-2 8:9:4.18
 * date Date日期 未用原型链，避免造成污染
 * format Date日期 未用原型链，避免造成污染
 * @param date
 * @returns {String}
 */
// eslint-disable-next-line
Date.prototype.format = (format) => {
  const formats = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    S: this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear().toString()).substr(4 - RegExp.$1.length));
  }
  Object.keys(formats).forEach((key) => {
    if (new RegExp(`(${key})`).test(format)) {
      format = format.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? formats[key] : ((`00${formats[key]}`).substr((`${formats[key]}`).length)));
    }
    return false;
  });
  return format;
};
