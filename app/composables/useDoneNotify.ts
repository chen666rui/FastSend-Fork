// 传输完成提醒
export function useDoneNotify(getDone: () => boolean) {
  function ding() {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext
      const c = new AC()
      const now = c.currentTime
      ;[880, 1320].forEach((freq, i) => {
        const osc = c.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = freq
        const g = c.createGain()
        const t = now + i * 0.12
        g.gain.setValueAtTime(0.0001, t)
        g.gain.exponentialRampToValueAtTime(0.25, t + 0.02)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)
        osc.connect(g).connect(c.destination)
        osc.start(t)
        osc.stop(t + 0.55)
      })
    } catch {
      /* 忽略 */
    }
  }

  function notify() {
    if (!('Notification' in window)) return
    const show = () => new Notification('FastSend', { body: '🎉 文件传输完成！' })
    if (Notification.permission === 'granted') show()
    else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((p) => p === 'granted' && show())
    }
  }

  watch(getDone, (done) => {
    if (done) {
      ding()
      notify()
    }
  })
}