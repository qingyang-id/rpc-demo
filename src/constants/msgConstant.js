/**
 * @description
 * @author yq
 * @date 2018/3/31 下午2:15
 */
module.exports = {
  // 消息分类（直播，互动）
  CATALOGS: {
    LIVE: 'LIVE',
    CHAT: 'CHAT',
  },
  // 消息类型
  TYPES: {
    TEXT: 'TEXT', // 文本消息
    IMAGE: 'IMAGE', // 图片消息
    AUDIO: 'AUDIO', // 音频消息
    VIDEO: 'VIDEO', // 视频消息
    RED_PACKET: 'RED_PACKET', // 红包消息
    RECEIVE_RED_PACKET: 'RECEIVE_RED_PACKET', // 领红包消息
    TIP: 'TIP', // 打赏消息
    DELETE: 'DELETE', // 删除消息，不存储
    REVOKE: 'REVOKE', // 撤回消息，不存储
  }
};
