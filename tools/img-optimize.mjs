import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const PUB = path.join(ROOT, 'public')

for (const f of fs.readdirSync(PUB)) {
  if (!/\.png$/i.test(f)) continue
  const src = path.join(PUB, f)
  const out = path.join(PUB, f.replace(/\.png$/i, '.webp'))
  const before = fs.statSync(src).size
  await sharp(src).webp({ quality: 82 }).toFile(out)
  const after = fs.statSync(out).size
  console.log(`✅ ${f}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${Math.round((1 - after / before) * 100)}%)`)
}