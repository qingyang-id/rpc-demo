/**
 * @description 返回错误码
 * @author      yq
 * @date        2018-01-30 20:06:25
 */

module.exports = {
  SUCCESS: 0, // 成功
  FAILED: 1, // 失败
  ERR_SERVER: 500, // 系统错误
  ERR_PARAMS: 400, // 参数错误
  TOKEN_EXPIRE: 401, // token过期
  TOKEN_INVALID: 403, // token不正确或权限不足
  ERR_LIMIT: 1001, // 每页数量不正确，取值范围: 0-100
  ERR_OFFSET: 1002, // 数据偏移量不正确，必须为大于等于零的整数
  ERR_VERSION: 1003, // 版本号不正确
  ERR_SORTS: 1004, // 排序不正确
  ERR_SORT_NAME: 1005, // 排序字段不正确
  ERR_SORT_BY: 1006, // 排序方式不正确，必须为desc或asc
  ERR_START_TIME: 1007, // 开始时间不正确
  ERR_END_TIME: 1008, // 结束时间不正确
  FREQUENT_REQUEST: 1009, // 请求处理中...，请稍后
  // 版本信息
  VERSION: {
    ERR_DEVICE: 2001, // 设备信息不正确，可选值：ios，android
    NOT_FOUND: 2002, // 版本信息不存在
  },
  // redis相关信息
  REDIS: {
    TOO_FAST: 4000
  },

  // 组合
  COMBINANTION: {
    NOT_FOUND: 6201, // 组合信息不存在
    USER_HAS_PAY: 6202, // 用户已支付
    USER_HAS_CARE: 6203, // 用户已关注
    MESSAGE_SWITCH_NOT_FOUND: 6204, // 未找到消息开关
    MESSAGE_SWITCH_HAS_OPEN: 6205, // 消息已开启
  },

  // 短信验证码
  SMS: {
    SEND_FAILED: 7001, // 短信发送失败，请稍后重试
    SEND_FREQUENTLY: 7002, // 短信发送过于频繁，请稍后发送
    VERIFY_ERROR: 7003, // 短信验证码错误
    PHONE_BAD: 7004, // 手机号码不符合规范
    MAX_SEND_COUNT: 7005, // 短信发送次数过多，请明天再试
    SYSTEM_MAINTENANCE: 7006 // 抱歉，短信服务维护中，暂停服务
  },
  USER: {
    NOT_FOUND_BY_PHONE: 2100, // 没有找到此手机号用户
    EXISTS_PHONE: 2101, // 此手机号已存在用户
    USER_HAVE_PHONE: 2102, // 此用户已绑定手机号码
    PHONE_HAVE_REGISTER: 2103, // 此手机号已被注册
    NOT_EXISTS: 2112,
    PASSWORD_ERROR: 2110, // 密码错误
    NOT_REGISTER: 2104, // 您尚未注册，请先注册
    INVITE_IS_NOT_EXISTS: 2105,
    IS_ACTIVE: 2107, // 用户已经激活
    IS_NOT_ACTIVE: 2108
  },
  ACCOUNT: {
    NOT_ACCOUNT_INFO: 2400,
    WALLET_ADDRESS_HAS_EXISTS: 2401,
    WALLET_ADDRESS_ERROR: 2402,
    USER_HAS_BIND_ADDRESS: 2403,
    USER_ACCOUNT_NOT_ENOUGH: 2404,
    USER_HAS_NOT_BIND_ADDRESS: 2405,
    FROZEN: 2406,
  },

  GREETEST: {
    VALIDATE_ERROR: 2500,
    ERR_CLIENT: 2501,
  },

  DEFENSE: {
    ILLEGAL_USER: 2600, // 很抱歉，您疑似恶意用户，请稍后重试
  },

  IM: {
    CREATE_SIG_ERROR: 2700,
  },

  // 红包
  RED_PACKET: {
    NOT_FOUND: 2800, // 红包信息不存在
    UNAVAILABLE: 2801, // 很抱歉，该红包指定人方可领取
    EXPIRED: 2802, // 红包已过期，无法领取
    ALREADY_RECEIVED: 2803, // 您已领取过该红包，请勿重复领取
    NOT_LEFT: 2804, // 红包已领完
  },

  // 打赏
  TIP: {
    NOT_FOUND: 2900, // 打赏信息不存在
  },
  // 直播互动
  ROOM: {
    NOT_FOUND: 3000, // 直播间不存在
    NOT_AUTH_PUBLISH: 3010, // 没有发布权限
    NOT_FOUND_MSG: 3011, // 不存在的消息
    SPEAKER_NOT_FOUND: 3001 // 主讲人不存在
  }
};
