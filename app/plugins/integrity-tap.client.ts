export default defineNuxtPlugin(() => {
  const mk = () => ({ acc: new Uint8Array(32), len: 0 })
  const OUT = mk()
  const IN = mk()
  ;(window as any).__fsIntegrity = { OUT, IN }

  const toBytes = (data: any): Uint8Array => {
    if (typeof data === 'string') return new TextEncoder().encode(data)
    if (data instanceof ArrayBuffer) return new Uint8Array(data)
    if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
    return new Uint8Array(0)
  }

  async function feed(agg: ReturnType<typeof mk>, bytes: Uint8Array) {
    if (!bytes.length) return
    agg.len += bytes.length
    try {
      const d = new Uint8Array(await crypto.subtle.digest('SHA-256', bytes as any))
      for (let i = 0; i < 32; i++) agg.acc[i] ^= d[i]
    } catch {}
  }

  const origSend = RTCDataChannel.prototype.send
  RTCDataChannel.prototype.send = function (data: any) {
    feed(OUT, toBytes(data))
    return origSend.call(this, data)
  }

  const origAdd = RTCDataChannel.prototype.addEventListener
  RTCDataChannel.prototype.addEventListener = function (type: any, fn: any, opts: any) {
    if (type === 'message') {
      return origAdd.call(
        this,
        type,
        (e: any) => {
          feed(IN, toBytes(e.data))
          fn(e)
        },
        opts
      )
    }
    return origAdd.call(this, type, fn, opts)
  }

  const desc = Object.getOwnPropertyDescriptor(RTCDataChannel.prototype, 'onmessage')
  if (desc && desc.set) {
    const origSet = desc.set
    Object.defineProperty(RTCDataChannel.prototype, 'onmessage', {
      ...desc,
      set(fn: any) {
        origSet.call(this, (e: any) => {
          feed(IN, toBytes(e.data))
          fn(e)
        })
      }
    })
  }
})