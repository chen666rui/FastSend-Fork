<h1 align="center">FastSend重置版</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0Bata-blue.svg?style=flat-square" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" />
  </a>
</p>

<p align="center">
  <img src="./public/image.png" />
</p>

## 📖 项目介绍

FastSend重置版是基于FastSend的分支，基于 WebRTC 技术的点对点文件传输工具，支持快速的目录同步和文件传输。通过浏览器即可实现安全、高效的文件共享。

🌐 在线体验：[暂无]


## 所需环境

node.js

## ✨ 特性

- 🔒 点对点加密传输，确保数据安全
- 📁 支持文件和文件夹传输
- 🚀 局域网自动优化，传输更快
- 🎯 简单易用的界面设计
- 🌍 支持中英文界面
- 📲 支持PWA轻量安装
-  自定义界面颜色
<p align="center">
  <img src="./public/color.png" />
</p>


## 🛠️ 技术栈

- WebRTC
- Vue.js
- Nuxt 4
- Pinia
- TypeScript
- Modern File System API

## 🗂️ 目录结构

项目已按 Nuxt 4 默认约定迁移为 `app/` 目录结构：

- `app/`：前端应用层源码，包括页面、组件、stores、composables、utils、全局样式与 `app.vue`
- `server/`：Nitro 服务端接口与 WebSocket 信令逻辑
- `public/`：静态资源与 PWA 相关文件
- `presets/`：PrimeVue 主题预设

这样可以更清晰地分离前端应用层与服务端上下文，也更符合 Nuxt 4 的默认扫描方式。

## 📦 安装与构建

# yarn的安装与构建

```bash
# 安装依赖
yarn install

# 构建项目
yarn build
```

# npm的安装与构建
```bash
# 安装依赖
npm install

# 构建项目
npm run build
```
- # 使用脚本构建

- 进入./command文件夹
- 点击install.bat以安装依赖
- 点击build.bat以构建并启动

## 🚀 使用方法

```bash
# 启动服务
node .output/server/index.mjs
```

> [!IMPORTANT]
> 目录传输和同步需要 `HTTPS` 以及浏览器支持，一般新版本的桌面浏览器都支持
>
> 本项目自身的 HTTPS 配置方式（测试环境）请参考：
>
> - [原项目置顶 Issue](https://github.com/ShouChenICU/FastSend/issues/9#issuecomment-2562353775)
> - [Nuxt 部署教程（英文）](https://nuxt.com/docs/4.x/getting-started/deployment#entry-point)
>
> FastSend 不建议直接以 HTTPS 形式进行生产环境部署，而应当位于反向代理服务器之后，请参考：
>
> - [Nginx](https://nginx.org/en/docs/http/configuring_https_servers.html)
> - [Apache httpd](https://httpd.apache.org/docs/current/ssl/)
> - [Caddy](https://caddyserver.com/docs/quick-starts/https)
> - [Windows IIS](https://learn.microsoft.com/zh-cn/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)

# 使用cloudflare内网穿透（自带https）
- 1.下载
> [Python下载](https://www.python.org/)
打开链接后点击Download，选择自己的系统，在Stable Releases下选择Python版本及对应的安装包,打开安装包后需勾选添加到系统变量

> [cloudflare下载](https://github.com/cloudflare/cloudflared/releases)
下载后放进任意文件夹

- 2.配置
> 
打开项目根目录下的py文件夹，编辑cf穿透.py，第10-19行为配置区
>
- 必填:第12行的双引号里填cloudflare的路径并确认11行的端口是否正确
- 选填（可将每次的内网穿透信息发送到邮箱）：第15-18行的信息发件人邮箱在双引号里填你的邮箱，授权码如图:
<p align="center">
  <img src="./public/sqm.png" />
</p>
开启邮箱的IMAP/SMTP服务复制出现的授权码（只显示一次）填写到授权码对应的双引号里，下面服务器地址按注释填到双引号里，其他的邮箱一般都在授权码那一页，接受连接的邮箱也填自己的邮箱，完成后保存并退出。

- 3.启动
>
打开项目根目录，在地址栏输入CMD打开命令提示符，输入node .output/server/index.mjs启动项目，启动后双击打开Python文件（两个窗口不要关闭），打开你设置发送的邮箱点开未读邮件，找到发送的链接并打开，如果没有设置，查看Python窗口里的二级域名链接并在浏览器中打开








## 💡 使用提示

1. 确保浏览器启用了 WebRTC 功能
2. 如需传输文件夹或同步目录，请确保浏览器支持现代文件系统 API 并已启用 HTTPS 传输
3. 在同一局域网内传输速度最快
4. 建议在网络状态良好时使用，部分网络环境可能会阻止 P2P / WebRTC 正确建立连接，从而导致传输失败

## 👨‍💻 分支作者

**ZMOU058**

## 👨‍💻 原作者
**SHOUCHEN_**


## 📝 开源协议

本项目基于 MIT 协议开源。

## ⭐ 支持项目

如果这个项目对你有帮助，欢迎给一个 star 支持一下！

---

<a href="https://star-history.com/#ShouChenICU/Fastsend&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date" />
 </picture>
</a>

## 声明
 本md为FastSendmd更改