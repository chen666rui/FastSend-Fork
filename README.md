<h1 align="center">FastSend重置版</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0正式版-blue.svg?style=flat-square" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" />
  </a>
</p>


> -  注:此图片为1.0.0Bata版图片,不为新版本图片,仅供参考
<p align="center">
  <img src="./public/image.png" />
</p>

## 📖 项目介绍

FastSend重置版是基于FastSend的分支，基于 WebRTC 技术的点对点文件传输工具，支持快速的目录同步和文件传输。通过浏览器即可实现安全、高效的文件共享。重置版在保留原版全部能力的基础上，于**传输内核、安全隐私、UI 体验、部署工程**四个维度进行了全面深度增强。


🌐 在线体验：[暂无]

## 🔀 相比原版的改进

### 性能与内核
- **Nuxt 4 架构**：迁移 `app/` 目录约定，前后端分层更清晰，构建更快
- **零拷贝流式读取**：`File.stream()` 替代 `slice().arrayBuffer()`，GB 级大文件主线程不阻塞
- **ICE 自动重启**：网络闪断 / 换网传输不死
- **构建瘦身**：关闭 devtools、sitemap zeroRuntime，构建时长大幅缩短

### UI 交互
- 主题系统：5 预设色 + 自定义取色器 + 暗黑模式 + 一键恢复
- 机械键盘音效、完成“叮”声 + 系统通知
- 可视化仪表盘：直连雷达 / RTT 信号条 / 速度曲线 / ETA / SHA-256 完整性指纹
- 智能取件、传输历史、新页面中英双语

### 修复的原版 Bug
- 修复 DataChannel 背压事件不触发导致的传输死锁（“点火器”机制）
- 修复 `File.stream()` 的 `Uint8Array.buffer` 内存视图偏移陷阱
- 修复大文件传输时主线程同步读取造成的 UI 卡顿
- 修复 Node 24 下自签名证书脚本的异步 / CJS 兼容问题

### 部署与安全
- 自动 HTTPS（含局域网 IP SAN 的自签名证书）、`start.bat` 一键启动、隧道守护自动重启
- 安全响应头全套：HSTS / nosniff / X-Frame-Options / Referrer-Policy


## 所需环境

- node.js
- Python 3（可选，用于隧道守护/邮件推送脚本）
- cloudflared（可选，用于公网内网穿透）

## ✨ 特性

- 🔒 点对点加密传输，确保数据安全
- 📁 支持文件和文件夹传输
- 🚀 局域网自动优化，传输更快
- 🎯 简单易用的界面设计
- 🌍 支持中英文界面
- 📲 支持PWA轻量安装
- 🎨自定义界面颜色

> -  注:此图片为1.0.0Bata版图片,不为新版本图片,仅供参考
<p align="center">
  <img src="./public/color.png" />
</p>

## 📅 更新日志2026-08-15 （v1.0.0正式版）
> - **1.新增界面**：文本传送 `/text`、阅后即焚 `/burn`、一键诊断 `/check`
> - **2.新增传输内核优化**：`File.stream()` 零拷贝流式读取、ICE 自动重启换网存活
> - **3.新增可视化仪表盘**：局域网直连雷达、RTT 信号条、速度曲线、ETA、SHA-256 完整性指纹
> - **4.新增体验功能**：智能取件、传输历史、机械键盘音效、完成通知、自定义取色器、新页面中英双语
> - **5.新增部署工程**：`tools/auto-https.mjs` 自动 `HTTPS`隧道守护自动重启、`cf同步.py` 配置模板
> - **6.构建与安全优化**：关闭 `devtools`、`sitemap zeroRuntime`；新增全套安全响应头

# 新增功能:

- 📝 **文本传送**：粘贴文本生成压缩链接，打开即见，无需传文件
- 🔥 **阅后即焚**：AES-GCM 端到端加密，密钥只留在 URL `#` 片段（零知识），打开即自毁 + 溯源水印 + 24h 过期
- 🧠 **智能取件**：首页任意位置粘贴链接/取件码自动识别直达
- 📜 **传输历史**：本机记录最近收发，一键清空
- 🩺 **一键诊断 `/check`**：HTTPS 上下文 / WebRTC / NAT 穿透自动体检
- 📡 **局域网直连雷达**：千兆直连触发时弹出可视化横幅
- 📶 **实时信号条**：RTT 延迟四级信号格
- 🔐 **完整性指纹**：两端 SHA-256 指纹一致 = 字节级零损坏
- ⏱️ **ETA 预估** + 📈 **实时速度曲线**
- ⌨️ **机械键盘音效**（Web Audio 合成，零音频文件）+ 🔔 **完成“叮”声与系统通知**
- 🛡️ **ICE 自动重启**：换网/闪断传输不死
- 🚀 **零拷贝流式读取**：`File.stream()` 让 GB 级大文件传输 UI 保持 60fps
- 🔒 **自动 HTTPS**：自签名证书自动生成（含局域网 IP SAN）
- 🚀 **`start.bat` 一键启动** + 🛡️ **隧道守护进程**崩溃自动重启
- 🛡️ **安全响应头**：HSTS / nosniff / DENY / Referrer-Policy 全套

## 🛠️ 技术栈

- WebRTC
- Vue.js / Nuxt 4 / Pinia / TypeScript
- Modern File System API
- Web Crypto API（AES-GCM）
- CompressionStream / DecompressionStream
- Web Audio API

## 🗂️ 目录结构

项目已按 Nuxt 4 默认约定迁移为 `app/` 目录结构：

- `app/`：前端应用层源码，包括页面、组件、stores、composables、utils、全局样式与 `app.vue`
- `app/plugins/`：底层旁路插件（音效 / 直连雷达 / 完整性指纹）
- `server/`：Nitro 服务端接口与 WebSocket 信令逻辑
- `public/`：静态资源与 PWA 相关文件
- `presets/`：PrimeVue 主题预设
- `tools/`：`auto-https.mjs` 自动 HTTPS 启动器
- `start.bat`：一键启动（构建检查 + HTTPS 服务 + 隧道守护）
- `cf同步.example.py`：隧道守护配置模板

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


# 增强启动方式（推荐,自带内网HTTPS）
```bash

# 启动自动HTTPS（默认端口3443）
node tools/auto-https.mjs

```
# 普通启动方式
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

# 🙏 特别致谢
本项目的核心功能与基础架构均来自 **ShouChenICU** 开发的开源项目：
- **原项目地址**：[ShouChenICU/FastSend](https://github.com/ShouChenICU/FastSend)
- **原项目体验**：[fastsend](https://fastsend.ing)



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
 本项目为FastSend分支项目,Md引用原版格式和部分内容
