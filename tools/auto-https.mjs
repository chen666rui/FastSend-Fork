import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CERT_DIR = path.join(ROOT, '.certs')
const CERT_FILE = path.join(CERT_DIR, 'cert.pem')
const KEY_FILE = path.join(CERT_DIR, 'key.pem')
const PORT = process.env.HTTPS_PORT || 3443

function lanIPs() {
  const ips = []
  for (const list of Object.values(os.networkInterfaces())) {
    for (const i of list || []) {
      if (i.family === 'IPv4' && !i.internal) ips.push(i.address)
    }
  }
  return ips
}

// 🛠️ 改为 async
async function ensureCert() {
  if (fs.existsSync(CERT_FILE) && fs.existsSync(KEY_FILE)) return
  fs.mkdirSync(CERT_DIR, { recursive: true })
  
  const require = createRequire(import.meta.url)
  const mod = require('selfsigned')
  
  const generateFn = mod.generate || mod.default?.generate || mod.default || mod
  
  if (typeof generateFn !== 'function') {
    console.error('❌ selfsigned 模块加载异常，找不到 generate 函数。')
    process.exit(1)
  }

  // 🛠️ 加上 await，等待 Promise 完成
  const pems = await generateFn([{ name: 'commonName', value: 'FastSend Local' }], {
    days: 825,
    keySize: 2048,
    extensions: [
      {
        name: 'subjectAltName',
        altNames: [
          { type: 2, value: 'localhost' },
          { type: 7, ip: '127.0.0.1' },
          ...lanIPs().map((ip) => ({ type: 7, ip }))
        ]
      }
    ]
  })

  if (!pems || !pems.cert || !pems.private) {
    console.error('❌ 证书生成失败！pems 结构异常')
    process.exit(1)
  }

  fs.writeFileSync(CERT_FILE, pems.cert)
  fs.writeFileSync(KEY_FILE, pems.private)
  console.log('🔏 已生成自签名证书（825 天，含局域网 IP）')
}

// 🚀 顶层 await 等待证书生成完毕
await ensureCert()

console.log('🔒 HTTPS 服务启动中…')
console.log(`   本机: https://localhost:${PORT}`)
for (const ip of lanIPs()) {
  console.log(`   局域网: https://${ip}:${PORT}  ← 手机直接开（首次点 高级→继续）`)
}

const child = spawn(process.execPath, [path.join(ROOT, '.output', 'server', 'index.mjs')], {
  stdio: 'inherit',
   env: {
    ...process.env,
    PORT: String(PORT),
    NITRO_PORT: String(PORT),
    // 🛠️ 核心修复：读取证书文件的内容传给 Nitro，而不是传路径
    NITRO_SSL_CERT: fs.readFileSync(CERT_FILE, 'utf-8'),
    NITRO_SSL_KEY: fs.readFileSync(KEY_FILE, 'utf-8')
  }
})
child.on('exit', (c) => process.exit(c ?? 0))