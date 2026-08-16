<h1 align="center">FastSend-Fork</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-2.1.0--Pro-blue.svg?style=flat-square" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" />
  </a>
</p>

<p align="center">
  <img src="./public/image.png" />
</p>

## 📖 About the Project

FastSend-Fork is a fork of FastSend, a peer-to-peer file transfer tool built on WebRTC technology that supports fast directory synchronization and file transfer. It enables secure and efficient file sharing directly through the browser.
While retaining all the original capabilities, this version has been comprehensively enhanced across four dimensions: **transfer core, security & privacy, UI experience, and deployment engineering**.

## Prerequisites

- Node.js ≥ 22
- Python 3 (Optional, for tunnel watchdog / email push scripts)
- cloudflared (Optional, for public network tunneling)

## ✨ Features

**Base Features (Inherited)**
- 🔒 Peer-to-peer encrypted transfer to ensure data security
- 📁 Supports both file and folder transfers
- 🚀 Automatic LAN optimization for faster transfers
- 🎯 Simple and user-friendly interface design
- 🌍 Bilingual interface support (Chinese & English)
- 📲 Lightweight PWA installation
- 🎨 Customizable UI colors

<p align="center">
  <img src="./public/color.png" />
</p>

**Enhanced Features**

🔥 **New Transfer Modes**
- 📝 **Text Transfer**: Switch between plain text / code highlighting / Markdown rendering.
- 🔥 **Burn After Reading**: AES-GCM 256 end-to-end encryption. The key lives only in the URL `#` fragment (zero-knowledge). Optional **verbal passphrase two-factor authentication**. Traceability watermark. 24h self-destruct.
- 🩺 **One-Click Diagnostics `/check`**: Automatic health checks for HTTPS context / WebRTC / NAT traversal.

🚀 **Transfer Core**
- **Zero-Copy Streaming Reads**: `File.stream()` + memory view offset fix. Keeps the UI at 60fps for GB-scale files.
- 🛡️ **Automatic ICE Restart**: Transfers survive network switches or drops.
- 🔥 **Backpressure Igniter**: Fixes deadlocks during large file transfers.
- ⏸️ **Pause/Resume**: One-click freeze and resume for large file transfers.
- 📋 **Screenshot Direct-Send**: `Ctrl+V` to paste and send screenshots directly from the homepage.
- 🖱️ **Drag & Drop**: Drop files anywhere on the page to trigger sending.
- 👀 **Online Preview**: Preview received images/videos/audio/PDFs/text without saving to disk.
- 🔁 **Auto-Rename Duplicates**: Appends `(1)/(2)` to prevent blind overwriting.
- 🗂️ **Auto-Categorization**: Automatically sorts downloaded images/videos/audio/documents/archives into folders.
- 🔐 **SHA-256 Integrity Fingerprint**: Matching fingerprints on both ends = byte-level zero corruption.
- 📶 **RTT Signal Bars / 📈 Speed Curve / ⏱️ ETA Estimation**

🎨 **UX & Interface**
- 🎨 **Theme System**: 5 preset colors + custom color picker + dark mode + one-click restore.
- ⌨️ **Mechanical keyboard sounds** + 🔔 completion "ding" + system notifications.
- 🧠 **Smart Pickup**: Auto-detects and routes pasted links or pickup codes.
- 📜 **Transfer History**: Local logging of recent transfers.
- 💥 **Branded Error Pages**: Custom 404/500 pages.
- 🌐 **Full Bilingual Support**: Complete English/Chinese localization for all new pages.

🛡️ **Deployment & Security**
- 🔒 **Automatic HTTPS**: Auto-generates self-signed certificates (valid for 825 days, including LAN IP SANs).
- 🚀 **One-Click `start.bat`** + tunnel watchdog with crash auto-restart + auto-start on boot.
- ☁️ **Cloudflare Workers Public Demo**.
- 🩺 **`/api/health` Endpoint** + UptimeRobot downtime notifications.
- 🚦 **Signaling Rate Limiting**: 120 requests per minute per IP to prevent abuse.
- 💓 **WS Heartbeat**: 5-second ping to keep connections alive.
- 💾 **Unified `transCount` Storage**: Auto-switches between Node disk / CF KV / memory fallback.
- 🛡️ **Full Security Headers**: HSTS / nosniff / DENY / Referrer-Policy.
- ⚡ **PWA Static Caching**: Instant second load + WebP image optimization.

🧪 **Engineering Quality**
- ✅ **Vitest Unit Tests** + ESLint gates + TypeScript strict mode.
- 📄 **Community Docs**: CONTRIBUTING / ROADMAP / Issue & PR templates.
- 🔁 **Dual CI Engines**: (npm + Yarn 4) with 4 jobs (build, test, lint).

## 🛠️ Tech Stack

- WebRTC
- Vue.js / Nuxt 4 / Pinia / TypeScript
- Modern File System API
- Web Crypto API (AES-GCM / PBKDF2)
- CompressionStream / DecompressionStream
- Web Audio API
- Workbox (PWA Caching)
- highlight.js / marked / DOMPurify

## 🗂️ Directory Structure

The project has been migrated to the Nuxt 4 default `app/` directory convention:

- `app/`: Front-end application source code (pages, components, stores, composables, utils, global styles, and `app.vue`).
- `app/plugins/`: Low-level side-channel plugins (sound effects / direct-connect radar / integrity fingerprint).
- `app/composables/`: Completion notification / transfer history logic.
- `server/`: Nitro server-side APIs and WebSocket signaling logic.
- `server/middleware/`: Signaling rate-limiting middleware.
- `public/`: Static assets and PWA-related files.
- `presets/`: PrimeVue theme presets.
- `tools/`: `auto-https.mjs` (auto HTTPS) / `img-optimize.mjs` (image compression).
- `tests/`: Vitest unit tests.
- `cf_sync.py`: Tunnel watchdog configuration template.

This allows for a clearer separation between the front-end application layer and the server context, aligning with Nuxt 4's default scanning behavior.

## 📦 Installation & Build

### Using Yarn

```bash
# Install dependencies
yarn install

# Build the project
yarn build
```

### Using npm

```bash
# Install dependencies
npm install --legacy-peer-deps

# Build the project
npm run build
```

### Using Bundled Scripts

- Navigate to the `./command` folder.
- Click `install.bat` to install dependencies.
- Click `build.bat` to build and start.

## 🚀 Usage

```bash
# Standard startup
node .output/server/index.mjs
```

**Enhanced Startup (Recommended)**
```bash
# Start automatic HTTPS (default port 3443)
node tools/auto-https.mjs
```

> [!IMPORTANT]
> Directory transfer and synchronization require `HTTPS` and browser support, which is generally supported by modern desktop browsers.
>
> For the project's own HTTPS configuration method (test environment), please refer to:
>
> - [Original Project Pinned Issue](https://github.com/ShouChenICU/FastSend/issues/9#issuecomment-2562353775)
> - [Nuxt Deployment Tutorial (English)](https://nuxt.com/docs/4.x/getting-started/deployment#entry-point)
>
> FastSend is not recommended to be deployed directly in HTTPS for production environments. Instead, it should be placed behind a reverse proxy server:
>
> - [Nginx](https://nginx.org/en/docs/http/configuring_https_servers.html)
> - [Apache httpd](https://httpd.apache.org/docs/current/ssl/)
> - [Caddy](https://caddyserver.com/docs/quick-starts/https)
> - [Windows IIS](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis)

## Using Cloudflare Tunnel (Built-in HTTPS)

**1. Download**
> [Python Download](https://www.python.org/)
> Open the link, click Download, select your system, and choose the Python installer under Stable Releases. **Make sure to check "Add Python to PATH"** during installation.

> [Cloudflare Download](https://github.com/cloudflare/cloudflared/releases)
> Download `cloudflared` and place it in any folder.

**2. Configuration**
> Open the `py` folder in the project root directory and edit `cf_tunnel.py` (formerly `cf穿透.py`). Lines 10-19 are the configuration area.

- **Required**: Fill in the path to `cloudflared` in the double quotes on line 12, and confirm the port on line 11 is correct.
- **Optional** (sends tunnel info to your email each time): Fill in your email in the double quotes for the sender email on lines 15-18. The authorization code is shown in the image below:

<p align="center">
  <img src="./public/sqm.png" />
</p>

Enable the IMAP/SMTP service for your email provider and copy the generated authorization code (displayed only once). Paste it into the corresponding double quotes. Fill in the server addresses according to the comments, and set the receiving email to your own. Save and exit when done.

**3. Startup**
> Open the project root directory, type `CMD` in the address bar to open the Command Prompt, and enter `node .output/server/index.mjs` to start the project. After starting, double-click to open the Python file (do not close either window). Open the unread email sent to your configured address, find the tunnel link, and open it. If not configured via email, check the subdomain link printed in the Python window and open it in your browser.

## 💡 Usage Tips

1. Ensure WebRTC is enabled in your browser.
2. To transfer folders or sync directories, ensure your browser supports the Modern File System API and HTTPS transfer is enabled.
3. Transfer speeds are fastest within the same LAN (triggers the direct-connect radar banner).
4. It is recommended to use it under good network conditions. Some network environments may block P2P / WebRTC from establishing connections correctly, leading to transfer failures.
5. After updating the version, please use `Ctrl + F5` to force refresh the pages on both ends to avoid mixing old and new code.
6. For self-signed HTTPS, the first visit requires clicking "Advanced -> Proceed" in the browser. This is normal behavior.

## 📅 Changelog

### 2026-08-16
1. **UX**: Pause/resume, online preview, screenshot direct-send, auto-rename duplicates, auto-categorization on disk.
2. **Content**: Text transfer 3-mode switching (plain/code/markdown), burn-after-reading verbal passphrase 2FA.
3. **Quality**: Vitest unit tests, ESLint gates, TS strict mode, branded error pages.
4. **Assets**: WebP image optimization, PWA static caching for instant second load.
5. **Server**: `/api/health` endpoint, signaling rate-limiting, unified `transCount` persistent storage layer.
6. **Community**: CONTRIBUTING / ROADMAP / Issue & PR templates; CI added `test` + `lint` jobs.

### 2026-08-15
1. **New Pages**: Text transfer `/text`, burn-after-reading `/burn`, one-click diagnostics `/check`.
2. **Transfer Core**: `File.stream()` zero-copy streaming reads, automatic ICE restart, backpressure igniter.
3. **Visual Dashboard**: LAN direct-connect radar, RTT signal bars, speed curve, ETA, SHA-256 integrity fingerprint.
4. **UX Features**: Smart pickup, transfer history, mechanical keyboard sounds, completion notifications, custom color picker, bilingual support.
5. **Deployment**: Automatic HTTPS, one-click `start.bat`, tunnel watchdog, CF Workers public demo, dual CI engines.
6. **Build & Security**: Disabled devtools, sitemap `zeroRuntime`, full security header suite.

### FastSend-Fork Base
1. Migrated to Nuxt 4 `app/` directory structure.
2. Added `command/` one-click install/build scripts.
3. Added `py/` LAN tunneling + email push scripts.
4. Added custom UI color themes.

## 👨‍💻 FastSend-Fork Author

**chen666rui (ZMOU058)**

## 👨‍💻 Original Author

**SHOUCHEN_**

## 🙏 Special Thanks

The core features and basic architecture of this project are derived from the open-source project developed by **ShouChenICU**:
- **Original Project**: [ShouChenICU/FastSend](https://github.com/ShouChenICU/FastSend)
- **Original Demo**: [fastsend.ing](https://fastsend.ing)

## 📝 License

This project is open-source under the MIT License.

## ⭐ Support the Project

If this project is helpful to you, please give it a star to show your support!

---

<a href="https://star-history.com/#ShouChenICU/Fastsend&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ShouChenICU/Fastsend&type=Date" />
 </picture>
</a>

## Disclaimer
This README is based on the original FastSend README. Changelog updated (2026-08-15 / 2026-08-16).
