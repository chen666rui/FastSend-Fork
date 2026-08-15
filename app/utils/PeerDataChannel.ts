interface PeerDataChannelConfig {
  iceServers?: RTCIceServer[]
  blockSize?: number
  initializeDataChannel?: boolean
}

export class PeerDataChannel {
  private static readonly DEFAULT_BLOCK_SIZE = 32768

  private pc: RTCPeerConnection
  private dc: RTCDataChannel | null = null
  private receiveData: {
    startTime: number
    offset: number
    count: number
    type: string
    chunks: (string | ArrayBuffer)[]
  } = { startTime: 0, offset: 0, count: 0, type: '', chunks: [] }
  private sendPromiseReject: ((reason?: any) => void) | null = null
  private eventQueue: EventQueue<ArrayBuffer | string>
  private blockSize: number
  private isRestartingIce = false

  public onReceive: (
    data: ArrayBuffer | string,
    info: { size: number; duration: number }
  ) => Promise<void> = async () => {}
  public onSDP: (sdp: RTCSessionDescriptionInit) => void = () => {}
  public onICECandidate: (candidate: RTCIceCandidate) => void = () => {}
  public onError: (e: Error) => void = () => {}
  public onConnected: () => void = () => {}
  public onDispose: () => void = () => {}
  public onOpen: () => void = () => {}

  constructor(config: PeerDataChannelConfig = {}) {
    this.blockSize = config.blockSize || PeerDataChannel.DEFAULT_BLOCK_SIZE
    this.eventQueue = new EventQueue(this.onData.bind(this))
    this.pc = new RTCPeerConnection({ iceServers: config.iceServers })
    this.setupPeerConnection()
    if (config.initializeDataChannel) this.initializeDataChannel()
  }

  private setupPeerConnection(): void {
    this.pc.ondatachannel = this.handleDataChannel.bind(this)
    this.pc.onnegotiationneeded = this.reNegotiation.bind(this)
    this.pc.onicecandidate = (e) => e.candidate && this.onICECandidate(e.candidate)
    this.pc.onicecandidateerror = () => {}
    this.pc.onconnectionstatechange = this.handleConnectionStateChange.bind(this)

    // 🛡️ ICE 自动重启（换网存活）
    this.pc.oniceconnectionstatechange = () => {
      const state = this.pc.iceConnectionState
      if ((state === 'disconnected' || state === 'failed') && !this.isRestartingIce) {
        this.isRestartingIce = true
        console.warn('[PDC] ICE 连接丢失，尝试自动重启...')
        try {
          this.pc.restartIce()
        } catch (e) {
          console.error('ICE 重启失败', e)
          this.dispose()
          this.onDispose()
        }
      } else if (state === 'connected' || state === 'completed') {
        this.isRestartingIce = false
      }
    }
  }

  private handleDataChannel(e: RTCDataChannelEvent): void {
    this.dc = e.channel
    this.setupDataChannel()
  }

  private initializeDataChannel(): void {
    this.dc = this.pc.createDataChannel('dc')
    this.setupDataChannel()
  }

  private setupDataChannel(): void {
    if (!this.dc) return
    this.dc.bufferedAmountLowThreshold = 0
    this.dc.onmessage = (e) => this.eventQueue.enqueue(e.data)
    this.dc.onopen = () => this.onOpen()
  }

  private handleConnectionStateChange(): void {
    // 🛡️ 注意：disconnected 不再直接销毁，留给 ICE 重启机会
    if (['closed', 'failed'].includes(this.pc.connectionState)) {
      this.dispose()
      this.onDispose()
    } else if (this.pc.connectionState === 'connected') {
      this.onConnected()
    }
  }

  private async onData(data: ArrayBuffer | string): Promise<void> {
    const receiveData = this.receiveData
    if (receiveData.offset === receiveData.count) {
      const dat = JSON.parse(data as string)
      this.receiveData = {
        startTime: Date.now(),
        offset: 0,
        count: dat.count,
        type: dat.type,
        chunks: []
      }
    } else {
      receiveData.chunks.push(data)
      receiveData.offset++
      if (receiveData.offset === receiveData.count) {
        const endTime = Date.now()
        const b = new Blob(receiveData.chunks)
        const result = receiveData.type === 'string' ? await b.text() : await b.arrayBuffer()
        await this.onReceive(result, { size: b.size, duration: endTime - receiveData.startTime })
        receiveData.chunks = []
      }
    }
  }

  /**
   * 发送数据（串行调用）—— 恢复原版已验证的背压逻辑，修复死锁
   */
  public async sendData(data: ArrayBuffer | string): Promise<void> {
    if (!this.dc) throw new Error('Data channel not initialized')

    return new Promise<void>((resolve, reject) => {
      this.sendPromiseReject = reject
      const dc = this.dc!
      dc.bufferedAmountLowThreshold = 0
      const count = Math.ceil(
        (typeof data === 'string' ? data.length : data.byteLength) / this.blockSize
      )
      let offset = 0

      dc.onbufferedamountlow = () => {
        if (count - offset > 16) {
          dc.bufferedAmountLowThreshold = 16 * this.blockSize
        } else {
          dc.bufferedAmountLowThreshold = 0
        }
        for (let i = 0; i < 32; i++) {
          if (offset < count) {
            const chunk = data.slice(this.blockSize * offset, this.blockSize * (offset + 1))
            dc.send(<string>chunk)
            offset++
            if (offset >= count) {
              resolve()
              break
            }
          }
        }
      }
      dc.send(JSON.stringify({ count, type: typeof data }))
    })
  }

  private async reNegotiation(): Promise<void> {
    return this.pc
      .createOffer({ iceRestart: this.isRestartingIce })
      .then((offer) => this.pc.setLocalDescription(offer))
      .then(() => (this.pc.localDescription ? this.onSDP(this.pc.localDescription) : undefined))
      .catch((e) => {
        console.error(e)
        this.onError(e instanceof Error ? e : new Error('Unknown error during renegotiation'))
        this.dispose()
      })
  }

  public async setRemoteSDP(sdp: RTCSessionDescriptionInit): Promise<void> {
    try {
      await this.pc.setRemoteDescription(sdp)
      if (sdp.type === 'offer') {
        const answer = await this.pc.createAnswer()
        await this.pc.setLocalDescription(answer)
        this.onSDP(answer)
      }
    } catch (e) {
      console.error(e)
      this.onError(e instanceof Error ? e : new Error('Error setting remote SDP'))
      this.dispose()
    }
  }

  public async addICECandidate(candidate: RTCIceCandidateInit): Promise<void> {
    await this.pc.addIceCandidate(candidate)
  }

  public isConnected(): boolean {
    return this.pc.connectionState === 'connected'
  }

  public getReceivedBufferSize(): number {
    return this.receiveData.chunks.reduce(
      (size, dat) => size + (typeof dat === 'string' ? dat.length : dat.byteLength),
      0
    )
  }

  public dispose(): void {
    if (this.sendPromiseReject) {
      this.sendPromiseReject()
      this.sendPromiseReject = null
    }
    if (this.dc) {
      this.dc.close()
      this.dc = null
    }
    this.pc.onicecandidate = null
    this.pc.ontrack = null
    this.pc.ondatachannel = null
    this.pc.oniceconnectionstatechange = null
    this.pc.onsignalingstatechange = null
    this.pc.onicegatheringstatechange = null
    this.pc.onnegotiationneeded = null
    this.pc.close()
  }
}

export class EventQueue<T> {
  private tail: Promise<void> = Promise.resolve()
  private handler: (e: T) => Promise<void>

  constructor(handler: (e: T) => Promise<void>) {
    this.handler = handler
  }

  public enqueue(e: T): void {
    this.tail = this.tail
      .then(() => this.handler(e))
      .catch((error) => {
        console.error('Error processing event:', error)
      })
  }
}