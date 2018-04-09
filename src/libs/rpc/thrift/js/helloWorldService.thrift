namespace java com.rpc.thrift.service

include "base.thrift"

service  HelloWorldService {
  base.Response say(1:base.Request req)
}
