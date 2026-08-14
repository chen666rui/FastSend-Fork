import fs from 'fs'

let transCount = 0
if (!fs.existsSync('transCount')) {
  saveTransCount()
}
transCount = Number(fs.readFileSync('transCount').toString('utf8'))
if (!transCount) {
  transCount = 0
  saveTransCount()
}

console.log('transCount: ' + transCount)

function saveTransCount() {
  fs.writeFileSync('transCount', transCount + ' ', 'utf8')
}

export function increaseTransCount() {
  transCount++
  saveTransCount()
  console.log('transCount: ' + transCount)
}

export function getTransCount() {
  return transCount
}
