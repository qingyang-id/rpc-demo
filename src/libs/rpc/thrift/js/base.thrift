namespace java com.rpc.thrift.service

struct Request {
1: required string request;
}

struct Response {
1: required i32 code;
2: optional string message;
3: optional string data;
}
