/**
 * @description redis key常量
 * @author yq
 * @date 2018/3/8 下午4:15
 */

module.exports = {
  smsKey: 'sms:$type:$phone',
  smsCountKey: 'sms:count:$phone',
  smsIpCountKey: 'sms:ip:count:$ip',
  validateKey: 'validate:$id',
  imSigKey: 'im:sig:$name',
  visitorKey: 'visitor:count',
  redPacketKey: 'red:packet:$id', // 红包信息key
  redPacketCountKey: 'red:packet:count:$id', // 红包数量key
  lockKey: 'lock:$type:$key', // 请求锁key
  liveRoomKey: 'live:room:', // 直播房间号key
};
