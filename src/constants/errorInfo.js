/**
 * @description 错误信息，TODO 后期配置到数据库
 * @author      yq
 * @date        2018-01-30 20:08:07
 */
const ErrorCode = require('./errorCode.js');

module.exports = {
  [ErrorCode.SUCCESS]: 'success', // 成功
  [ErrorCode.FAILED]: '请求失败，请稍后重试',
  [ErrorCode.ERR_SERVER]: '系统错误',
  [ErrorCode.TOKEN_EXPIRE]: '登录身份过期，请重新登录',
  [ErrorCode.TOKEN_INVALID]: '权限不足或身份信息不正确',
  [ErrorCode.ERR_LIMIT]: '每页数量不正确',
  [ErrorCode.ERR_OFFSET]: '数据偏移量不正确，取值范围: 0-9999',
  [ErrorCode.ERR_VERSION]: '版本号不正确',
  [ErrorCode.ERR_SORTS]: '排序信息不正确',
  [ErrorCode.ERR_SORT_NAME]: '排序字段不正确',
  [ErrorCode.ERR_SORT_BY]: '排序方式不正确，必须为desc或asc',
  [ErrorCode.ERR_PARAMS]: '参数错误',
  [ErrorCode.FREQUENT_REQUEST]: '请求处理中...，请稍后',

  // 版本
  [ErrorCode.VERSION.ERR_DEVICE]: '设备信息不正确，可选值：ios，android',
  [ErrorCode.VERSION.NOT_FOUND]: '版本信息不存在',

  // 组合
  [ErrorCode.COMBINANTION.NOT_FOUND]: '组合信息不存在',
  [ErrorCode.COMBINANTION.USER_HAS_PAY]: '用户已支付',
  [ErrorCode.COMBINANTION.USER_HAS_CARE]: '用户已关注',
  [ErrorCode.COMBINANTION.MESSAGE_SWITCH_NOT_FOUND]: '消息开关不存在',
  [ErrorCode.COMBINANTION.MESSAGE_SWITCH_HAS_OPEN]: '消息已开启',
  // 短信
  [ErrorCode.SMS.SEND_FAILED]: '短信发送失败，请稍后重试',
  [ErrorCode.SMS.SEND_FREQUENTLY]: '短信发送过于频繁，请稍后发送',
  [ErrorCode.SMS.VERIFY_ERROR]: '验证码错误',
  [ErrorCode.SMS.PHONE_BAD]: '请输入正确的手机号',
  [ErrorCode.SMS.MAX_SEND_COUNT]: '短信发送次数过多，请明天再试',
  [ErrorCode.SMS.SYSTEM_MAINTENANCE]: '系统正在维护升级，3月19日22时重新开放注册',

  //  用户
  [ErrorCode.USER.NOT_FOUND_BY_PHONE]: '此手机号没有注册',
  [ErrorCode.USER.EXISTS_PHONE]: '此手机号已被绑定',
  [ErrorCode.USER.NOT_EXISTS]: '用户不存在',
  [ErrorCode.USER.PASSWORD_ERROR]: '密码错误',
  [ErrorCode.USER.USER_HAVE_PHONE]: '此用户已绑定手机号码',
  [ErrorCode.USER.NOT_ACCOUNT_INFO]: '账户信息缺失',
  [ErrorCode.USER.PHONE_HAVE_REGISTER]: '此手机号已被注册',
  [ErrorCode.USER.NOT_REGISTER]: '您尚未注册，请先注册',
  [ErrorCode.USER.INVITE_IS_NOT_EXISTS]: '邀请人已达上线，请删除邀请码',
  [ErrorCode.USER.IS_ACTIVE]: '用户已经激活',
  [ErrorCode.USER.IS_NOT_ACTIVE]: '未设置密码,请快捷登录',

  // 钱包信息
  [ErrorCode.ACCOUNT.NOT_ACCOUNT_INFO]: '用户账户不存在',
  [ErrorCode.ACCOUNT.WALLET_ADDRESS_HAS_EXISTS]: '要绑定的钱包地址已被绑定',
  [ErrorCode.ACCOUNT.WALLET_ADDRESS_ERROR]: '钱包地址有误',
  [ErrorCode.ACCOUNT.USER_HAS_BIND_ADDRESS]: '用户已绑定了钱包地址',
  [ErrorCode.ACCOUNT.USER_ACCOUNT_NOT_ENOUGH]: '用户账户余额不足',
  [ErrorCode.ACCOUNT.USER_HAS_NOT_BIND_ADDRESS]: '用户还未绑定钱包',
  [ErrorCode.ACCOUNT.FROZEN]: '账户被冻结',

  // 图形验证码
  [ErrorCode.GREETEST.VALIDATE_ERROR]: '图形验证码校验失败，请重试',
  [ErrorCode.GREETEST.ERR_CLIENT]: '客户端类型错误',

  // 防御
  [ErrorCode.DEFENSE.ILLEGAL_USER]: '很抱歉，系统怀疑您为恶意用户，请稍后重试',
  // redis相关信息
  [ErrorCode.REDIS.TOO_FAST]: '正在处理,请稍等',

  // IM
  [ErrorCode.IM.CREATE_SIG_ERROR]: '生成IM签名失败，请稍后重试',

  // 红包
  [ErrorCode.RED_PACKET.NOT_FOUND]: '红包信息不存在',
  [ErrorCode.RED_PACKET.UNAVAILABLE]: '很抱歉，该红包指定人方可领取',
  [ErrorCode.RED_PACKET.EXPIRED]: '红包已过期，无法领取',
  [ErrorCode.RED_PACKET.ALREADY_RECEIVED]: '您已领取过该红包，请勿重复领取',
  [ErrorCode.RED_PACKET.NOT_LEFT]: '红包已领完',

  // 打赏
  [ErrorCode.TIP.NOT_FOUND]: '打赏信息不存在',
  // 直播互动
  [ErrorCode.ROOM.NOT_FOUND]: '直播间不存在',
  [ErrorCode.ROOM.NOT_AUTH_PUBLISH]: '没有发布权限',
  [ErrorCode.ROOM.SPEAKER_NOT_FOUND]: '主讲人不存在',
  [ErrorCode.ROOM.NOT_FOUND_MSG]: '不存在的消息',
};
