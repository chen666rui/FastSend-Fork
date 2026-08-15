export default defineNuxtPlugin(() => {
  let ctx: AudioContext | null = null

  function ensureCtx(): AudioContext {
    if (!ctx) {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  const isEnabled = () => localStorage.getItem('fs-key-sound') === 'on'

  // 用 Web Audio 合成机械键盘声（无需任何音频文件）
  function playKey(type: 'type' | 'back' | 'click') {
    try {
      const c = ensureCtx()
      const now = c.currentTime

            // 🖱️ 真实鼠标点击：高频瞬态(咔) + 低频共振(哒)
      if (type === 'click') {
        const dur = 0.04
        // 1. 瞬态噪声 (塑料碰撞的“咔”)
        const bufLen = Math.floor(c.sampleRate * 0.005)
        const nBuf = c.createBuffer(1, bufLen, c.sampleRate)
        const nData = nBuf.getChannelData(0)
        for (let i = 0; i < bufLen; i++) {
          nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 20)
        }
        const noise = c.createBufferSource()
        noise.buffer = nBuf
        const hpf = c.createBiquadFilter()
        hpf.type = 'highpass'
        hpf.frequency.value = 3000 + Math.random() * 1000 // 随机高频，避免死板
        const ng = c.createGain()
        ng.gain.setValueAtTime(0.5, now)
        ng.gain.exponentialRampToValueAtTime(0.001, now + 0.02)
        noise.connect(hpf).connect(ng).connect(c.destination)
        noise.start(now)

        // 2. 低频回弹 (微动开关的“哒”)
        const osc = c.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(400 + Math.random() * 100, now)
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.03)
        const og = c.createGain()
        og.gain.setValueAtTime(0.3, now)
        og.gain.exponentialRampToValueAtTime(0.001, now + dur)
        osc.connect(og).connect(c.destination)
        osc.start(now)
        osc.stop(now + dur)
        return
      }

      // 键帽：噪声爆点 + 低频底音
      const dur = type === 'back' ? 0.07 : 0.05
      const bufferSize = Math.floor(c.sampleRate * dur)
      const buffer = c.createBuffer(1, bufferSize, c.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3)
      }
      const noise = c.createBufferSource()
      noise.buffer = buffer
      const filter = c.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value =
        type === 'back' ? 1500 + Math.random() * 800 : 2500 + Math.random() * 1500
      filter.Q.value = 1.2
      const g = c.createGain()
      g.gain.setValueAtTime(type === 'back' ? 0.3 : 0.22, now)
      g.gain.exponentialRampToValueAtTime(0.001, now + dur)
      noise.connect(filter).connect(g).connect(c.destination)
      noise.start(now)

      const osc = c.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(160 + Math.random() * 50, now)
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.05)
      const og = c.createGain()
      og.gain.setValueAtTime(0.12, now)
      og.gain.exponentialRampToValueAtTime(0.001, now + 0.06)
      osc.connect(og).connect(c.destination)
      osc.start(now)
      osc.stop(now + 0.07)
    } catch {
      /* 音频异常静默忽略 */
    }
  }

  // ⌨️ 输入框打字 → 哒哒声；退格键 → 更低沉的“嗒”
  window.addEventListener('keydown', (e) => {
    if (!isEnabled() || e.ctrlKey || e.metaKey || e.altKey) return
    const t = e.target as HTMLElement
    const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
    if (!typing) return
    if (e.key === 'Backspace' || e.key === 'Delete') playKey('back')
    else if (e.key.length === 1) playKey('type')
  })

  // 🖱️ 点按钮 → 清脆点击声
  window.addEventListener('pointerdown', (e) => {
    if (!isEnabled()) return
    const t = e.target as HTMLElement
    if (t && t.closest('button')) playKey('click')
  })
})