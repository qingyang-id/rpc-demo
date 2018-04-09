# rpc-demo 微服务架构demo
基于thrift, grpc的微服务框架demo。

## 接口开发规范
### 返回内容
1.接口路径 不能有大写字母，如果多个单词用/分开
2.字符类型，如果为空一律返回空字符串，避免返回null的情况，必要的字段必须返回


## 启动脚本

``` bash
# install dependencies
npm install

# 启动grpc服务端
npm run grpc

# 启动thrift服务端
npm run thrift

# 启动网关（API）服务，以3000端口启动项目，浏览器通过 [访问链接](http://localhost:3000) 访问
npm run start
```

## 查看日志
* 本地看运行日志即可
* 测试和生产环境  tail -f logs/out.log
