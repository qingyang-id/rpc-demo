namespace java com.dlhr.zhiliao.thrift.service

struct ThriftRequest {
1: optional map<string,string> params;
2: optional map<string,string> session;
}