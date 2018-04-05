namespace java com.rpc.thrift.service

include "thriftRequest.thrift"

service  HelloWordService {
  string sayHello(1:thriftRequest.ThriftRequest req)
}
