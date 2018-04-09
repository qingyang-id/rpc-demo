#将指定接口生成typescript格式的文件
thrift-0.9.3.exe --gen js:ts  hello.thrift
#将指定接口生成node格式的文件
thrift-0.9.3.exe --gen js:node  AdminService.thrift
thrift-0.9.3.exe --gen js:node  AnchorService.thrift
thrift-0.9.3.exe --gen js:node  ThriftRequest.thrift
thrift-0.9.3.exe --gen js:node  UserService.thrift
thrift-0.9.3.exe --gen js:node  GeneralService.thrift
thrift-0.9.3.exe --gen js:node  FamilyService.thrift
thrift-0.9.3.exe --gen js:node  RoomService.thrift

#mac
thrift -o ./src/libs/rpc/thrift/js --gen js:node ./src/libs/rpc/thrift/js/base.thrift
thrift -o ./src/libs/rpc/thrift/js --gen js:node ./src/libs/rpc/thrift/js/helloWorldService.thrift
thrift -o ./src/libs/rpc/thrift/js --gen js:node ./src/libs/rpc/thrift/js/calculateService.thrift
