# Google Search NCR

一个 Tampermonkey 用户脚本，强制 Google 搜索页面使用 `www.google.com`，避免自动跳转到国家或地区 Google 域名。

## 安装

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 或其他兼容的用户脚本管理器。
2. 点击下面的链接，并在用户脚本管理器中确认安装：

### [点击安装脚本](https://raw.githubusercontent.com/PaulHerrero/google-search-ncr/main/google-search-ncr.user.js)

## 功能

- 将 Google 搜索、首页和 WebHP 页面规范化到 `www.google.com`
- 使用 Google 官方 `/ncr` 入口设置无国家重定向偏好
- 保留原始搜索路径、查询参数和搜索内容
- 在页面加载开始阶段运行，减少重定向过程中的页面闪烁

## 说明

脚本只处理 Google 首页、搜索页面和 `/ncr` 页面，不会干预其他 Google 服务。
