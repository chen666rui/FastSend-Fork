export default defineNuxtPlugin(() => {
  const OrigPC = window.RTCPeerConnection
  if (!OrigPC) return

  window.RTCPeerConnection = class extends OrigPC {
    constructor(config?: RTCConfiguration) {
      super(config)
      let checked = false
      this.addEventListener('connectionstatechange', async () => {
        if (checked || this.connectionState !== 'connected') return
        checked = true
        try {
          const stats = await this.getStats()
          let localType = ''
          let remoteType = ''
          stats.forEach((report: any) => {
            if (report.type === 'candidate-pair' && report.state === 'succeeded') {
              const lc = stats.get(report.localCandidateId)
              const rc = stats.get(report.remoteCandidateId)
              if (lc && rc) {
                localType = lc.candidateType || ''
                remoteType = rc.candidateType || ''
              }
            }
          })
          if (localType === 'host' && remoteType === 'host') {
            window.dispatchEvent(new CustomEvent('fs-lan-direct'))
          }
          // 📶 每秒广播实时延迟
          const rttTimer = setInterval(async () => {
            if (this.connectionState !== 'connected') {
              clearInterval(rttTimer)
              return
            }
            try {
              const s = await this.getStats()
              let rtt = 0
              s.forEach((r: any) => {
                if (r.type === 'candidate-pair' && r.state === 'succeeded' && r.currentRoundTripTime != null) {
                  rtt = r.currentRoundTripTime * 1000
                }
              })
              window.dispatchEvent(new CustomEvent('fs-rtt', { detail: { rtt: Math.round(rtt) } }))
            } catch {}
          }, 1000)
        } catch {
          /* 忽略 */
        }
      })
    }
  } as any
})