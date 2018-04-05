/**
 * @description 腾讯云IM相关常量
 * @author yq
 * @date 2018/3/26 下午5:26
 */
module.exports = {
  // 账号管理
  accountImportApi: '/v4/im_open_login_svc/account_import',
  // 修改用户资料
  portraitSetApi: '/v4/profile/portrait_set',
  // 获取用户资料
  portraitGetApi: '/v4/profile/portrait_get',

  // 群组管理
  // 获取APP所有群组
  getAppIdGroupListApi: '/v4/group_open_http_svc/get_appid_group_list',
  // 新建群组
  createGroupApi: '/v4/group_open_http_svc/create_group',
  // 获取群组详细信息
  getGroupInfoApi: '/v4/group_open_http_svc/get_group_info',
  // 获取群组详细信息
  getGroupMsgGetSimpleApi: '/v4/group_open_http_svc/group_msg_get_simple',
  // 发送群组普通消息
  sendGroupMsgApi: '/v4/group_open_http_svc/send_group_msg',
  // 禁言/取消禁言
  forbidSendMsgApi: '/v4/group_open_http_svc/forbid_send_msg',
  // 获取禁言列表
  getForbidsApi: '/v4/group_open_http_svc/get_group_shutted_uin',
  // 解散群组
  destroyGroupApi: '/v4/group_open_http_svc/destroy_group',
  // 群组中发送系统通知
  sendGroupSystemNoticeApi: '/v4/group_open_http_svc/send_group_system_notification',

  // 在线状态
  // 1、获取用户在线状态
  queryStateApi: '/v4/openim/querystate',

  // 单聊消息
  // 1、单发单聊消息
  sendMsgApi: '/v4/openim/sendmsg',
  // 2、批量发单聊消息
  batchSendMsgApi: '/v4/openim/batchsendmsg',
};
