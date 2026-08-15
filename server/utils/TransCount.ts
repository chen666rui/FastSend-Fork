import fs from 'node:fs'
import path from 'node:path'

// 尝试定位计数文件
const countFile = path.join(process.cwd(), 'transCount.json')
let count = 0

// 🛡️ 1. 初始化读取（兼容 CF Workers：如果没硬盘就静默忽略，使用内存计数 0）
try {
  if (fs.existsSync(countFile)) {
    const data = fs.readFileSync(countFile, 'utf-8')
    count = JSON.parse(data).count || 0
  }
} catch (e) {
  // 在 CF Workers 中 fs 会抛出 unenv 异常，在这里被安全捕获
}

export function getTransCount() {
  return count
}

export function saveTransCount() {
  // 🛡️ 2. 写入硬盘（兼容 CF Workers：写不了就不写，反正演示站重启清零也无所谓）
  try {
    fs.writeFileSync(countFile, JSON.stringify({ count }))
  } catch (e) {
    // 在 CF Workers 中无法写盘，静默忽略
  }
}

export function increaseTransCount() {
  count++
  saveTransCount()
}
