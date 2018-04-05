namespace java com.rpc.thrift.service

include "thriftRequest.thrift"

service  CalculateService {
  string count(1:thriftRequest.ThriftRequest req)
}
