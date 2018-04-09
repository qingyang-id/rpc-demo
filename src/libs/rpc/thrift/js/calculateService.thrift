namespace java com.rpc.thrift.service

include "base.thrift"

service  CalculateService {
  base.Response count(1:base.Request req)
}
