# Change Log
All notable changes to this project will be documented in this file.

## 0.1.3 (2017-01-25)

- 在about页面展示捐赠列表

## 0.1.2 (2017-01-25)

- 新增About页面，支持支付宝、微信捐赠
- 取消用户头像
- 暂时屏蔽无效菜单
- 美化 `Dashboard` 页面
- 完成 `Api Group` 管理功能（非Owner，不能删除；同时不能删除第一个）
- 在项目列表中，显示是否为Owner。

## 0.1.1 (2017-01-24)

- 修复维护API页面，添加Header时候，回车返回到list页面
- 修复顶部一级菜单，和左侧二级菜单与主页面不符合的问题
- `Feedback` 链接到 `Github New Issue` 页面
- `API List` 页面，增加显示最后更新人员
- 新增 `API Group` 维护页面

## 0.1.0 (2017-01-20)

- 发布新版本，采用Vue2 + Semantic UI
- 支持多人项目

## 0.0.3 (2016-09-08)

- 修复Modal不能兼容IE的bug（引入babel-polyfill）
- 修复prod模式下注入到index.html的资源加载顺序不正确
- 登录之后，在header上显示用户名
- 增强 API Response 编辑器，支持代码着色
- 修复API维护界面，Final Address多出undefined的bug

## 0.0.2 (2016-09-07)

- 创建项目时，可配置授权用户
- 项目列表可访问我管理的项目
- API列表可访问我管理的API

## 0.0.1 (2016-09-06)

- 登录注册功能实现
- APP、API管理界面实现
