# tokenclub 后端服务
后端API基于nodejs的koa搭建。

## sql语句及数据字典
https://github.com/TokenClub2017/publicDocs/tree/master/databases  数据字典
https://github.com/TokenClub2017/publicDocs/tree/master/databases/sql  建表的sql语句存放目录，以版本的时间(开始或上线时间，8位数字)作为目录，如20180314，上线前通知运维执行对应的sql

## 接口开发规范
### 返回内容
·接口路径 不能有大写字母，如果多个单词用/分开
·字符类型，如果为空一律返回空字符串，避免返回null的情况，必要的字段必须返回


# rpc-demo
