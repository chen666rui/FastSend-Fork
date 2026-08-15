<h1 align="center">FastSend-Fork</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0_Official-blue.svg?style=flat-square" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" />
  </a>
</p>

##                                        English | [中文](./README.md)

> - Note: The screenshots below are from the v1.0.0 Beta and may not reflect the latest version. For reference only.
<p align="center">
  <img src="./public/image.png" />
</p>

## 📖 About the Project

FastSend-Fork is a fork of FastSend — a peer-to-peer file transfer tool built on WebRTC that supports fast directory synchronization and file transfer. It enables secure, efficient file sharing directly through the browser. While retaining all of the original's capabilities, this reset edition is deeply enhanced across four dimensions: **transfer core, security & privacy, UI experience, and deployment engineering**.

🌐 Live demo: [Coming soon]

## 🔀 Improvements over the Original

### Performance & Core
- **Nuxt 4 architecture**: Migrated to the `app/` directory convention for a cleaner front-end/back-end separation and faster builds
- **Zero-copy streaming reads**: `File.stream()` replaces `slice().arrayBuffer()` — the main thread no longer blocks on GB-scale files
- **Automatic ICE restart**: Transfers survive network drops / network switches
- **Slimmed builds**: devtools disabled, sitemap `zeroRuntime` — build time drastically reduced

### UI & Interaction
- Theme system: 5 preset colors + custom color picker + dark mode + one-click restore
- Mechanical keyboard sounds, completion "ding" + system notifications
- Visual dashboard: direct-connect radar / RTT signal bars / speed curve / ETA / SHA-256 integrity fingerprint
- Smart pickup, transfer history, bilingual (zh/en) pages

### Original Bugs Fixed
- Fixed the transfer deadlock caused by DataChannel backpressure events not firing ("igniter" mechanism)
- Fixed the `Uint8Array.buffer` memory-view offset trap in `File.stream()`
- Fixed UI stutter caused by synchronous main-thread reads during large transfers
- Fixed async / CJS compatibility issues in the self-signed certificate script under Node 24

### Deployment & Security
- Automatic HTTPS (self-signed cert incl. LAN IP SANs), one-click `start.bat`, tunnel watchdog with auto-restart
- Full security header suite: HSTS / nosniff / X-Frame-Options / Referrer-Policy

## Prerequisites

- Node.js
- Python 3 (optional, for the tunnel watchdog / email push scripts)
- cloudflared (optional, for public tunneling)

## ✨ Features

- 🔒 Peer-to-peer encrypted transfer for data security
- 📁 File and folder transfer support
- 🚀 Automatic LAN optimization for faster transfers
- 🎯 Simple, easy-to-use interface
- 🌍 Bilingual UI (Chinese / English)
- 📲 Lightweight PWA installation
- 🎨 Customizable UI colors

> - Note: The screenshot below is from the v1.0.0 Beta and may not reflect the latest version. For reference only.
<p align="center">
  <img src="./public/color.png" />
</p>

## 📅 Changelog — 2026-08-15 (v1.0.0 Official)

> - **1. New pages**: text transfer `/text`, burn-after-reading `/burn`, one-click diagnostics `/check`
> - **2. Transfer core optimizations**: zero-copy streaming reads via `File.stream()`, automatic ICE restart for network-switch survival
> - **3. Visual dashboard**: LAN direct-connect radar, RTT signal bars, speed curve, ETA, SHA-256 integrity fingerprint
> - **4. UX additions**: smart pickup, transfer history, mechanical keyboard sounds, completion notifications, custom color picker, bilingual pages
> - **5. Deployment engineering**: `tools/auto-https.mjs` auto-HTTPS, tunnel watchdog with auto-restart, `cf同步.example.py` config template
> - **6. Build & security**: devtools disabled, sitemap `zeroRuntime`; full security header suite added

### New features in detail:

- 📝 **Text transfer**: paste text, get a compressed link — opens instantly, no file needed
- 🔥 **Burn after reading**: AES-GCM end-to-end encryption; the key lives only in the URL `#` fragment (zero-knowledge); self-destructs on open + traceability watermark + 24 h expiry
- 🧠 **Smart pickup**: paste a link / pickup code anywhere on the home page — auto-detected and routed
- 📜 **Transfer history**: local log of recent sends/receives, one-click clear
- 🩺 **One-click diagnostics `/check`**: automatic health check for HTTPS context / WebRTC / NAT traversal
- 📡 **LAN direct-connect radar**: visual banner when a gigabit direct link is established
- 📶 **Live signal bars**: 4-level RTT latency indicator
- 🔐 **Integrity fingerprint**: matching SHA-256 fingerprints on both ends = byte-level zero corruption
- ⏱️ **ETA estimation** + 📈 **real-time speed curve**
- ⌨️ **Mechanical keyboard sounds** (synthesized via Web Audio, zero audio files) + 🔔 completion "ding" & system notifications
- 🛡️ **Automatic ICE restart**: transfers survive network switches / drops
- 🚀 **Zero-copy streaming reads**: `File.stream()` keeps the UI at 60 fps even for GB-scale files
- 🔒 **Automatic HTTPS**: self-signed certificate auto-generated (incl. LAN IP SANs)
- 🚀 **One-click `start.bat`** + 🛡️ **tunnel watchdog** with crash auto-restart
- 🛡️ **Security headers**: full suite — HSTS / nosniff / DENY / Referrer-Policy

## 🛠️ Tech Stack

- WebRTC
- Vue.js / Nuxt 4 / Pinia / TypeScript
- Modern File System API
- Web Crypto API (AES-GCM)
- CompressionStream / DecompressionStream
- Web Audio API

## 🗂️ Directory Structure

The project has been migrated to the Nuxt 4 default `app/` directory convention:

- `app/`: front-end application source — pages, components, stores, composables, utils, global styles and `app.vue`
- `app/plugins/`: low-level side-channel plugins (sound effects / direct-connect radar / integrity fingerprint)
- `server/`: Nitro server API and WebSocket signaling logic
- `public/`: static assets and PWA-related files
- `presets/`: PrimeVue theme presets
- `tools/`: `auto-https.mjs` automatic HTTPS launcher
- `start.bat`: one-click startup (build check + HTTPS service + tunnel watchdog)
- `cf同步.example.py`: tunnel watchdog config template

This cleanly separates the front-end application layer from the server context and matches Nuxt 4's default scanning behavior.

## 📦 Installation & Build

### Using npm

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Using Yarn

```bash
# Install dependencies
yarn install

# Build the project
yarn build
```

### Using the bundled scripts

- Enter the `./command` folder
- Double-click `install.bat` to install dependencies
- Double-click `build.bat` to build and start

### Enhanced startup (recommended, built-in LAN HTTPS)

```bash
# Start automatic HTTPS (default port 3443)
node tools/auto-https.mjs
```

### Standard startup

```bash
# Start the service
node .output/server/index.mjs
```

> [!IMPORTANT]
> Directory transfer and synchronization require `HTTPS` and browser support; most recent desktop browsers support it.
>
> For HTTPS configuration of this project itself (test environments), see:
>
> - [Original project pinned issue](https://github.com/ShouChenICU/FastSend/issues/9#issuecomment-2562353775)
> - [Nuxt deployment guide (English)](https://nuxt.com/docs/4.x/getting-started/deployment#entry-point)
>
> For production, FastSend should **not** be exposed directly over HTTPS; place it behind a reverse proxy instead:
>
> - [Nginx](https://nginx.org/en/docs/http/configuring_https_servers.html)
> - [Apache httpd](https://httpd.apache.org/docs/current/ssl/)
> - [Caddy](https://caddyserver.com/docs/quick-starts/https)
> - [Windows IIS](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)

## Using Cloudflare Tunnel (built-in HTTPS)

**1. Download**

> [Python](https://www.python.org/)
> Open the link, click Download, pick your system, and choose a Python version under Stable Releases. During installation, make sure to check "Add Python to PATH".

> [cloudflared](https://github.com/cloudflare/cloudflared/releases)
> Download it and place it in any folder.

**2. Configure**

> Open the `py` folder in the project root and edit `cf穿透.py`; lines 10–19 are the configuration area.

- Required: on line 12, fill in the path to cloudflared inside the quotes, and verify the port on line 11 is correct
- Optional (email the tunnel URL on every start): on lines 15–18, fill in the sender email, etc. The authorization code is shown below:

<p align="center">
  <img src="./public/sqm.png" />
</p>

Enable IMAP/SMTP for your mailbox and copy the authorization code (shown only once) into the corresponding quotes; fill in the server address per the comments (for other providers, it's usually on the same page); set the receiving email to your own as well. Save and exit.

**3. Start**

> In the project root, type `CMD` in the address bar to open a Command Prompt and run `node .output/server/index.mjs`. Then double-click the Python file (keep both windows open). Open the unread email to find the tunnel link, or read the subdomain link printed in the Python window and open it in your browser.

## 💡 Usage Tips

1. Make sure WebRTC is enabled in your browser.
2. Folder transfer / directory sync requires the Modern File System API and HTTPS.
3. Transfers are fastest within the same LAN.
4. Use under a good network connection — some networks may block P2P / WebRTC and cause transfer failures.

## 👨‍ Fork Author

**ZMOU058**

## 🙏 Special Thanks

The core functionality and base architecture of this project come from the open-source project by **ShouChenICU**:

- **Original repository**: [ShouChenICU/FastSend](https://github.com/ShouChenICU/FastSend)
- **Original demo**: [fastsend.ing](https://fastsend.ing)

## 📝 License

This project is open-sourced under the MIT License.

## ⭐ Support the Project

If this project helps you, a star is very much appreciated!

---

<a href="https://star-history.com/#ShouChenICU/Fastsend&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date" />
 </picture>
</a>

## Disclaimer

This project is a fork of FastSend; this README reuses the original's format and some of its content.
